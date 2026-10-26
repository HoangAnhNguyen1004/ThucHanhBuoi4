import React from 'react';
import useDetail from '../../hooks/useDetail';
import ScreenContainer from '../../components/common/ScreenContainer';
import QueryDetail from '../../components/common/QueryDetail';
import InfoRow from '../../components/profile/InfoRow';
import { toScale4 } from '../../utils/gpa';

export default function GradeDetailScreen({ route, navigation }) {
    const query = useDetail(
        'grades',
        route.params.id,
        navigation,
        item => item.course?.name || 'Chi tiết kết quả',
    );
    const grade = query.data;

    return (
        <ScreenContainer scroll>
            <QueryDetail query={query}>
                <InfoRow label="Môn học" value={grade?.course?.name} />
                <InfoRow label="Học kỳ" value={grade?.semester} />
                <InfoRow label="Số tín chỉ" value={grade?.course?.credits} />
                <InfoRow label="Chuyên cần — 10%" value={grade?.attendance} />
                <InfoRow label="Giữa kỳ — 30%" value={grade?.midterm} />
                <InfoRow label="Cuối kỳ — 60%" value={grade?.final} />
                <InfoRow label="Tổng kết" value={grade?.total} />
                <InfoRow label="Điểm chữ" value={grade?.letter} />
                <InfoRow label="Điểm hệ 4" value={toScale4(grade?.total)} />
            </QueryDetail>
        </ScreenContainer>
    );
}