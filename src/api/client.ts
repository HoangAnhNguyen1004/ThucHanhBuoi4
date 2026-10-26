import { BASE_URL, TIMEOUT } from '../config';

export async function request(method, url, body = undefined) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);

    try {
        const response = await fetch(`${BASE_URL}${url}`, {
            method,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            signal: controller.signal,
            ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
        });

        if (!response.ok) {
            throw {
                type: 'http',
                status: response.status,
                message: `Máy chủ trả về lỗi ${response.status}. Vui lòng thử lại.`,
            };
        }

        if (response.status === 204) {
            return null;
        }

        return await response.json();
    } catch (error) {
        if (error.type) {
            throw error;
        }

        if (error.name === 'AbortError') {
            throw {
                type: 'timeout',
                status: 0,
                message: 'Kết nối quá 10 giây. Vui lòng kiểm tra máy chủ.',
            };
        }

        throw {
            type: 'network',
            status: 0,
            message: 'Không kết nối được máy chủ. Hãy kiểm tra mạng và json-server.',
        };
    } finally {
        clearTimeout(timer);
    }
}
