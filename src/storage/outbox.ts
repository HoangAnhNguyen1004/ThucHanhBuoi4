import AsyncStorage from '@react-native-async-storage/async-storage';
import { OUTBOX_KEY } from './keys';

let tail: Promise<any> = Promise.resolve();

function exclusive(task) {
    const next = tail.then(task, task);
    tail = next.catch(() => { });
    return next;
}

async function read() {
    const raw = await AsyncStorage.getItem(OUTBOX_KEY);

    if (!raw) {
        return [];
    }

    // Không âm thầm xóa hàng đợi nếu JSON bị hỏng.
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
        throw new Error('Không đọc được hàng đợi đồng bộ.');
    }

    return parsed;
}

export function getAll() {
    return exclusive(read);
}

export function enqueue(action) {
    return exclusive(async () => {
        const actions = await read();

        if (!actions.some(item => item.id === action.id)) {
            actions.push(action);
        }

        await AsyncStorage.setItem(OUTBOX_KEY, JSON.stringify(actions));

        return actions;
    });
}

export function remove(id) {
    return exclusive(async () => {
        const actions = (await read()).filter(item => item.id !== id);

        await AsyncStorage.setItem(OUTBOX_KEY, JSON.stringify(actions));

        return actions;
    });
}
