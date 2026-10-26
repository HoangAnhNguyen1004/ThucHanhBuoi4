import React from 'react';
import useDetail from '../../hooks/useDetail';
import ScreenContainer from '../../components/common/ScreenContainer';
import QueryDetail from '../../components/common/QueryDetail';
import InfoRow from '../../components/profile/InfoRow';
import { dayLabel } from '../../utils/date';

export default function SessionDetailScreen({ route, navigation }) {
    const query = useDetail(
        'sessions',
        route.params.id,
        navigation,
        item => item.course?.name || 'Chi tiết buổi học',
    );

    const item = query.data;

    return (
        <ScreenContainer scroll>
            <QueryDetail query={query}>
                <InfoRow label="Môn học" value={item?.course?.name} />
                <InfoRow label="Ngày học" value={dayLabel(item?.dayOfWeek)} />
                <InfoRow label="Giờ bắt đầu" value={item?.startTime} />
                <InfoRow label="Giờ kết thúc" value={item?.endTime} />
                <InfoRow label="Phòng học" value={item?.room} />
                <InfoRow label="Ghi chú" value={item?.note || 'Không có'} />
            </QueryDetail>
        </ScreenContainer>
    );
}