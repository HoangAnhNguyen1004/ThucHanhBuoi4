import * as studentService from '../api/studentService';
import * as courseService from '../api/courseService';
import * as sessionService from '../api/sessionService';
import * as assignmentService from '../api/assignmentService';
import * as gradeService from '../api/gradeService';
import * as cache from '../storage/cache';
import * as outbox from '../storage/outbox';

export const services = {
    students: studentService,
    courses: courseService,
    sessions: sessionService,
    assignments: assignmentService,
    grades: gradeService,
};

const listeners = new Set<() => void>();
const queries = new Map<string, any>();

let actions: any[] = [];
let isOnline = false;
let syncing = false;
let ready = false;
let initPromise;
let version = 0;
let writeVersion = 0;
let sequence = 0;
let tail: Promise<any> = Promise.resolve();
let lastError = '';
let notice = null;
let noticeSequence = 0;

function emit() {
    version += 1;
    listeners.forEach(listener => listener());
}

export const subscribe = listener => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

export const getVersion = () => version;

function exclusive(task) {
    const next = tail.then(task, task);
    tail = next.catch(() => { });
    return next;
}

export function initialize() {
    if (!initPromise) {
        initPromise = outbox.getAll().then(result => {
            actions = result as any[];
            ready = true;
            emit();
        }).catch(error => {
            initPromise = null;
            lastError = error.message || 'Không đọc được dữ liệu trên thiết bị.';
            emit();
            throw error;
        });
    }

    return initPromise;
}

export function setOnline(value) {
    if (isOnline !== value) {
        isOnline = value;
        emit();
    }
}

export function getSyncState() {
    return {
        isOnline,
        ready,
        syncing,
        pendingCount: actions.length,
        lastError,
        notice,
    };
}

export function queryEntry(key) {
    if (!queries.has(key)) {
        queries.set(key, {
            data: undefined,
            savedAt: null,
            error: null,
            loading: true,
            refreshing: false,
            hydrated: false,
            hydration: null,
            flight: null,
            fetcher: null,
        });
    }

    return queries.get(key);
}

function splitKey(key) {
    const index = key.indexOf(':');

    return index < 0
        ? { resource: key, id: null }
        : { resource: key.slice(0, index), id: key.slice(index + 1) };
}

function equalId(a, b) {
    return String(a) === String(b);
}

// Tính giao diện từ dữ liệu server/cache + toàn bộ thao tác chưa đồng bộ.
export function visibleData(key) {
    const entry = queryEntry(key);
    const { resource, id } = splitKey(key);
    const pending = actions.filter(action => action.resource === resource);

    if (id !== null) {
        let result = entry.data;

        if (!result) {
            const list = queries.get(resource)?.data;
            result = Array.isArray(list)
                ? list.find(item => equalId(item.id, id))
                : undefined;
        }

        pending.forEach(action => {
            if (equalId(action.entityId, id)) {
                result = { ...result, ...action.body, id: action.entityId };
            }
        });

        return result;
    }

    if (entry.data === undefined && pending.length === 0) {
        return undefined;
    }

    let result = Array.isArray(entry.data) ? [...entry.data] : [];

    pending.forEach(action => {
        const index = result.findIndex(item => equalId(item.id, action.entityId));

        if (index >= 0) {
            result[index] = { ...result[index], ...action.body };
        } else if (action.method === 'POST') {
            result.push({ ...action.body, id: action.entityId });
        }
    });

    return result;
}

export function isPending(resource, id) {
    return actions.some(action =>
        action.resource === resource && equalId(action.entityId, id),
    );
}

export async function hydrate(key) {
    const entry = queryEntry(key);

    if (entry.hydrated) {
        return;
    }

    if (entry.hydration) {
        return entry.hydration;
    }

    entry.hydration = (async () => {
        await initialize();

        const saved = await cache.getCache(key);

        if (saved) {
            entry.data = saved.data;
            entry.savedAt = saved.savedAt;
        } else {
            const { resource, id } = splitKey(key);

            if (id !== null) {
                const listCache = await cache.getCache(resource);
                const item = listCache?.data?.find?.(row => equalId(row.id, id));

                if (item) {
                    entry.data = item;
                    entry.savedAt = listCache.savedAt;
                }
            }
        }

        entry.hydrated = true;
        entry.loading = false;
        emit();
    })().finally(() => {
        entry.hydration = null;
    });

    return entry.hydration;
}

export async function loadQuery(key, fetcher, refresh = false) {
    const entry = queryEntry(key);
    entry.fetcher = fetcher;

    try {
        await hydrate(key);
    } catch (error) {
        entry.loading = false;
        entry.error = { message: error.message };
        emit();
        return;
    }

    if (!isOnline) {
        entry.loading = false;
        entry.refreshing = false;
        entry.error = visibleData(key) === undefined
            ? { message: 'Chưa có dữ liệu lưu trên máy. Hãy kết nối mạng rồi thử lại.' }
            : null;
        emit();
        return;
    }

    // Bản ghi vừa thêm offline chưa tồn tại trên server.
    const { resource, id } = splitKey(key);
    const localCreate = actions.some(action =>
        action.resource === resource &&
        equalId(action.entityId, id) &&
        action.method === 'POST',
    );

    if (id !== null && localCreate) {
        entry.loading = false;
        entry.error = null;
        emit();
        return;
    }

    if (entry.flight) {
        return entry.flight;
    }

    entry.error = null;
    entry.loading = visibleData(key) === undefined;
    entry.refreshing = refresh;
    emit();

    const revisionAtStart = writeVersion;

    entry.flight = (async () => {
        try {
            const data = await fetcher();

            // Không để GET khởi chạy trước một mutation ghi đè kết quả mutation.
            if (revisionAtStart !== writeVersion) {
                return;
            }

            const saved = await cache.setCache(key, data);
            entry.data = data;
            entry.savedAt = saved.savedAt;
            entry.error = null;
        } catch (error) {
            entry.error = error.type
                ? error
                : { message: error.message || 'Không lưu được dữ liệu trên thiết bị.' };
        } finally {
            entry.loading = false;
            entry.refreshing = false;
            entry.flight = null;
            emit();
        }
    })();

    return entry.flight;
}

function setNotice(message) {
    noticeSequence += 1;
    notice = { id: noticeSequence, message };
    emit();
}

// Cập nhật cả cache danh sách và cache chi tiết sau khi server xác nhận.
async function commitRecord(resource, record) {
    writeVersion += 1;

    const keys = [resource, `${resource}:${record.id}`];

    for (const key of keys) {
        const entry = queryEntry(key);
        await hydrate(key);

        let data;

        if (key === resource) {
            data = Array.isArray(entry.data) ? [...entry.data] : [];
            const index = data.findIndex(item => equalId(item.id, record.id));

            if (index >= 0) {
                // Giữ course đã expand nếu response PATCH không chứa course.
                data[index] = { ...data[index], ...record };
            } else {
                data.push(record);
            }
        } else {
            data = { ...entry.data, ...record };
        }

        const saved = await cache.setCache(key, data);
        entry.data = data;
        entry.savedAt = saved.savedAt;
        entry.error = null;
    }

    emit();
}

async function removeAction(id) {
    await outbox.remove(id);
    actions = actions.filter(action => action.id !== id);
    emit();
}

function withoutExpandedFields(body) {
    return Object.fromEntries(
        Object.entries(body).filter(([key]) => key !== 'course'),
    );
}

async function sendAction(action) {
    const service = services[action.resource];
    let server;

    try {
        server = await service.getById(action.entityId);
    } catch (error) {
        if (!(action.method === 'POST' && error.status === 404)) {
            throw error;
        }
    }

    if (action.method === 'POST') {
        // Nếu request POST trước đó đã tới server nhưng response bị mất,
        // bản ghi cùng ID được xem là đã tạo.
        return {
            record: server || await service.create(withoutExpandedFields(action.body)),
            conflict: false,
        };
    }

    const serverTime = new Date(server.updatedAt || 0).getTime();
    const actionTime = new Date(action.body.updatedAt || action.createdAt).getTime();

    if (serverTime > actionTime) {
        return { record: server, conflict: true };
    }

    return {
        record: await service.update(
            action.entityId,
            withoutExpandedFields(action.body),
        ),
        conflict: false,
    };
}

async function drain(rollbackId = null) {
    if (!isOnline || actions.length === 0) {
        return;
    }

    syncing = true;
    lastError = '';
    emit();

    let synced = 0;
    let conflicts = 0;

    try {
        while (isOnline && actions.length > 0) {
            const action = actions[0];

            try {
                const result = await sendAction(action);

                // Chỉ xóa outbox sau khi đã lưu kết quả server vào cache.
                await commitRecord(action.resource, result.record);
                await removeAction(action.id);

                if (result.conflict) {
                    conflicts += 1;
                } else {
                    synced += 1;
                }
            } catch (error) {
                lastError = error.message || 'Đồng bộ chưa thành công.';

                // Với thao tác vừa bấm khi online: lỗi HTTP thì hoàn tác.
                // Lỗi mạng/timeout giữ lại vì server có thể chưa nhận request.
                if (action.id === rollbackId && error.type === 'http') {
                    await removeAction(action.id);
                    throw error;
                }

                // Dừng tại thao tác lỗi, giữ đúng thứ tự FIFO.
                break;
            }
        }
    } finally {
        syncing = false;

        const messages = [];

        if (synced) {
            messages.push(`Đã đồng bộ ${synced} thay đổi.`);
        }

        if (conflicts) {
            messages.push(
                `${conflicts} thay đổi có xung đột: đã ưu tiên dữ liệu mới hơn trên server.`,
            );
        }

        if (messages.length) {
            setNotice(messages.join('\n'));
        }

        emit();
    }
}

export function syncNow() {
    return exclusive(async () => {
        await initialize();
        await drain();
    });
}

export async function mutate(resource, method, entityId, values) {
    await initialize();

    const now = new Date().toISOString();
    const id = `action-${Date.now()}-${++sequence}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;

    const action = {
        id,
        resource,
        entityId,
        method,
        url: method === 'POST'
            ? `/${resource}`
            : `/${resource}/${entityId}`,
        body: {
            ...values,
            ...(method === 'POST' ? { id: entityId } : {}),
            updatedAt: now,
        },
        createdAt: now,
    };

    // Overlay được thêm ngay để mọi tab cập nhật tức thì.
    actions = [...actions, action];
    writeVersion += 1;
    emit();

    return exclusive(async () => {
        try {
            await outbox.enqueue(action);
        } catch {
            actions = actions.filter(item => item.id !== action.id);
            emit();
            throw new Error('Không lưu được thao tác trên thiết bị. Vui lòng thử lại.');
        }

        if (isOnline) {
            await drain(action.id);
        }

        return {
            id: entityId,
            queued: actions.some(item => item.id === action.id),
        };
    });
}

export function newEntityId() {
    return `local-${Date.now()}-${++sequence}-${Math.random()
        .toString(36)
        .slice(2, 10)}`;
}
