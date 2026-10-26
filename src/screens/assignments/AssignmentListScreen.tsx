import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import useFeedback from '../../hooks/useFeedback';
import ScreenContainer from '../../components/common/ScreenContainer';
import QueryList from '../../components/common/QueryList';
import FilterChips from '../../components/common/FilterChips';
import AppButton from '../../components/common/AppButton';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import { isOverdue } from '../../utils/date';
import { R } from '../../navigation/routes';

const options = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Chưa xong', value: 'todo' },
    { label: 'Đã xong', value: 'done' },
    { label: 'Quá hạn', value: 'overdue' },
];

export default function AssignmentListScreen({ navigation }) {
    const app = useAppData();
    const feedback = useFeedback();
    const [filter, setFilter] = useState('all');

    const data = app.assignments.filter(item => {
        if (filter === 'all') return true;
        if (filter === 'overdue') return isOverdue(item);
        return item.status === filter;
    });

    return (
        <ScreenContainer>
            <QueryList
                query={app.assignmentQuery}
                data={data}
                emptyTitle="Không có bài tập phù hợp"
                header={
                    <>
                        <AppButton
                            title="+ Thêm bài tập"
                            onPress={() => navigation.navigate(R.AssignmentForm)}
                        />
                        <FilterChips options={options} selected={filter} onSelect={setFilter} />
                    </>
                }
                renderItem={({ item }) => (
                    <AssignmentItem
                        assignment={item}
                        pending={app.isPending('assignments', item.id)}
                        onPress={() => navigation.navigate(R.AssignmentDetail, { id: item.id })}
                        onToggleStatus={() => feedback(() => app.toggleAssignment(item))}
                    />
                )}
            />
        </ScreenContainer>
    );
}