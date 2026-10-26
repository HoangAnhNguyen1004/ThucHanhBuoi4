import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useAppData } from '../../context/AppDataContext';
import useDetail from '../../hooks/useDetail';
import useFeedback from '../../hooks/useFeedback';
import ScreenContainer from '../../components/common/ScreenContainer';
import QueryDetail from '../../components/common/QueryDetail';
import EmptyState from '../../components/common/EmptyState';
import InfoRow from '../../components/profile/InfoRow';
import SessionCard from '../../components/schedule/SessionCard';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import { R } from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function CourseDetailScreen({ route, navigation }) {
    const { id } = route.params;
    const query = useDetail('courses', id, navigation, item => item.name);
    const app = useAppData();
    const feedback = useFeedback();

    const sessions = app.sessions.filter(item => String(item.courseId) === String(id));
    const assignments = app.assignments.filter(item => String(item.courseId) === String(id));
    const course = query.data;

    return (
        <ScreenContainer scroll>
            <QueryDetail query={query}>
                <InfoRow label="Tên môn" value={course?.name} />
                <InfoRow label="Mã môn" value={course?.code} />
                <InfoRow label="Số tín chỉ" value={course?.credits} />
                <InfoRow label="Giảng viên" value={course?.lecturer} />
                <InfoRow label="Học kỳ" value={course?.semester} />
                <InfoRow label="Mô tả" value={course?.description} />

                <Text style={styles.heading}>Lịch học</Text>
                <QueryDetail query={app.sessionQuery}>
                    {sessions.length ? sessions.map(item => (
                        <SessionCard
                            key={String(item.id)}
                            session={item}
                            onPress={() => navigation.navigate(R.SessionDetail, { id: item.id })}
                        />
                    )) : <EmptyState title="Chưa có lịch học" />}
                </QueryDetail>

                <Text style={styles.heading}>Bài tập của môn</Text>
                <QueryDetail query={app.assignmentQuery}>
                    {assignments.length ? assignments.map(item => (
                        <AssignmentItem
                            key={String(item.id)}
                            assignment={item}
                            pending={app.isPending('assignments', item.id)}
                            onPress={() => navigation.navigate(R.AssignmentDetail, { id: item.id })}
                            onToggleStatus={() => feedback(() => app.toggleAssignment(item))}
                        />
                    )) : <EmptyState title="Chưa có bài tập" />}
                </QueryDetail>
            </QueryDetail>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    heading: { ...typography.h3, color: colors.text, marginTop: spacing.xl },
});