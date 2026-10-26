import { parseLocalDateTime } from './date';

export function validateAssignment(values: Record<string, any>) {
    const errors: Record<string, string> = {};
    const dueDate = parseLocalDateTime(values.dueDate);

    if (!values.title.trim()) {
        errors.title = 'Vui lòng nhập tiêu đề.';
    }

    if (!values.courseId) {
        errors.courseId = 'Vui lòng chọn môn học.';
    }

    if (!dueDate) {
        errors.dueDate = 'Nhập đúng định dạng dd/MM/yyyy HH:mm.';
    } else if (dueDate.getTime() <= Date.now()) {
        errors.dueDate = 'Hạn nộp phải ở tương lai.';
    }

    return errors;
}

export function validateProfile(values: Record<string, any>) {
    const errors: Record<string, string> = {};

    if (!values.fullName.trim()) {
        errors.fullName = 'Vui lòng nhập họ tên.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
        errors.email = 'Email chưa hợp lệ.';
    }

    if (!/^\+?\d{9,15}$/.test(values.phone.trim())) {
        errors.phone = 'Số điện thoại gồm 9–15 chữ số.';
    }

    return errors;
}
