/** @param {Function} onSelectDay - Bắt buộc */
import React from 'react';
import FilterChips from '../common/FilterChips';
import { todayDay, dayLabel } from '../../utils/date';

export default function DaySelector({
    selectedDay = todayDay(),
    onSelectDay,
}) {
    return (
        <FilterChips
            selected={selectedDay}
            onSelect={onSelectDay}
            options={[2, 3, 4, 5, 6, 7, 8].map(value => ({
                value,
                label: dayLabel(value),
            }))}
        />
    );
}