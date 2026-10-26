/**
 * @param {string} status - Bắt buộc
 * @param {Function} onToggle - Bắt buộc
 */
import React from 'react';
import AppButton from '../common/AppButton';

export default function StatusToggle({ status, onToggle }) {
    return (
        <AppButton
            title={status === 'done' ? '✓ Đã xong' : '○ Chưa xong'}
            onPress={onToggle}
            variant={status === 'done' ? 'primary' : 'outline'}
        />
    );
}