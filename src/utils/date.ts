const pad = value => String(value).padStart(2, '0');

export function formatDate(value, mode = 'date') {
    if (!value) {
        return '';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    const dateText =
        `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;

    const timeText = `${pad(date.getHours())}:${pad(date.getMinutes())}`;

    if (mode === 'time') {
        return timeText;
    }

    if (mode === 'datetime') {
        return `${timeText}, ${dateText}`;
    }

    return dateText;
}

export function isOverdue(assignment) {
    return (
        assignment.status !== 'done' &&
        new Date(assignment.dueDate).getTime() < Date.now()
    );
}

export function daysLeft(value) {
    return Math.ceil((new Date(value).getTime() - Date.now()) / 86400000);
}

export function todayDay() {
    const day = new Date().getDay();
    return day === 0 ? 8 : day + 1;
}

export function dayLabel(day) {
    return Number(day) === 8 ? 'Chủ nhật' : `Thứ ${day}`;
}

// Nhập theo giờ địa phương, sau đó chuyển ISO để lưu server.
export function parseLocalDateTime(value) {
    const match = value.trim().match(
        /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})$/,
    );

    if (!match) {
        return null;
    }

    const [, dd, mm, yyyy, hh, min] = match.map(Number);
    const date = new Date(yyyy, mm - 1, dd, hh, min);

    if (
        date.getFullYear() !== yyyy ||
        date.getMonth() !== mm - 1 ||
        date.getDate() !== dd ||
        date.getHours() !== hh ||
        date.getMinutes() !== min
    ) {
        return null;
    }

    return date;
}