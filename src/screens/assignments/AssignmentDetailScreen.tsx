import React from 'react';
import { useAppData } from '../../context/AppDataContext';
import useDetail from '../../hooks/useDetail';
import useFeedback from '../../hooks/useFeedback';
import ScreenContainer from '../../components/common/ScreenContainer';
import QueryDetail from '../../components/common/QueryDetail';
import SyncBadge from '../../components/common/SyncBadge';
import StatusToggle from '../../components/assignment/StatusToggle';
import InfoRow from '../../components/profile/InfoRow';
import { formatDate } from '../../utils/date';

export default function AssignmentDetailScreen({ route, navigation }) {
    const query = useDetail(
        'assignments',
        route.params.id,
        navigation,
        item => item.title,
    );

    const app = useAppData();
    const feedback = useFeedback();
    const item = query.data;

    const course = app.courses.find(
        row => String(row.id) === String(item?.courseId),
    ) || item?.course;

    return (
        <ScreenContainer scroll>
            <QueryDetail query={query}>
                <InfoRow label="Tiêu đề" value={item?.title} />
                <InfoRow label="Môn học" value={course?.name} />
                <InfoRow label="Mô tả" value={item?.description || 'Không có'} />
                <InfoRow label="Hạn nộp" value={formatDate(item?.dueDate, 'datetime')} />
                {item ? (
                    <StatusToggle
                        status={item.status}
                        onToggle={() => feedback(() => app.toggleAssignment(item))}
                    />
                ) : null}
                <SyncBadge pending={app.isPending('assignments', route.params.id)} />
            </QueryDetail>
        </ScreenContainer>
    );
}