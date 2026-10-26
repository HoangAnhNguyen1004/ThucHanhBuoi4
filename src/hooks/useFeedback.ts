import { useCallback } from 'react';
import { Alert } from 'react-native';

export default function useFeedback() {
    return useCallback(async task => {
        try {
            return await task();
        } catch (error) {
            Alert.alert(
                'Không thực hiện được',
                error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.',
            );
            return undefined;
        }
    }, []);
}