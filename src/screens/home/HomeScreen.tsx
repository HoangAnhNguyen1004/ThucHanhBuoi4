import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import useFeedback from '../../hooks/useFeedback';
import ScreenContainer from '../../components/common/ScreenContainer';
import QueryList from '../../components/common/QueryList';
import QueryDetail from '../../components/common/QueryDetail';
import AppButton from '../../components/common/AppButton';
import CourseCard from '../../components/course/CourseCard';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import EmptyState from '../../components/common/EmptyState';
import { R } from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function HomeScreen({ navigation }) {
    const app = useAppData();
    const sync = useSync();
    const feedback = useFeedback();
    const now = Date.now();

    const upcoming = app.assignments.filter(item => {
        const due = new Date(item.dueDate).getTime();
        return item.status !== 'done' && due >= now && due <= now + 7 * 86400000;
    });

    const refresh = () => Promise.all([
        app.studentQuery.refresh(),
        app.courseQuery.refresh(),
        app.assignmentQuery.refresh(),
    ]);

    const query = {
        ...app.assignmentQuery,
        refresh,
        refreshing:
            app.studentQuery.refreshing ||
            app.courseQuery.refreshing ||
            app.assignmentQuery.refreshing,
    };

    return (
        <ScreenContainer>
            <QueryList
                query={query}
                data={upcoming}
                extraData={sync.pendingCount}
                emptyTitle="Không có bài tập đến hạn trong 7 ngày tới"
                header={
                    <View>
                        <QueryDetail query={app.studentQuery}>
                            <Text style={styles.title}>
                                Xin chào, {app.student?.fullName}
                            </Text>
                            <Text style={styles.text}>
                                Mã sinh viên: {app.student?.studentCode}
                            </Text>
                        </QueryDetail>

                        <Text style={styles.text}>
                            Thay đổi chưa đồng bộ: {sync.pendingCount}
                        </Text>

                        {sync.lastError ? (
                            <Text style={styles.error}>{sync.lastError}</Text>
                        ) : null}

                        <AppButton
                            title="Đồng bộ ngay"
                            loading={sync.syncing}
                            disabled={!sync.isOnline}
                            onPress={() => feedback(sync.syncNow)}
                        />

                        <Text style={styles.section}>Môn đang học</Text>
                        <QueryDetail query={app.courseQuery}>
                            {app.courses.length ? app.courses.map(course => (
                                <CourseCard
                                    key={String(course.id)}
                                    course={course}
                                    onPress={() => navigation.navigate(R.CourseDetail, { id: course.id })}
                                />
                            )) : <EmptyState title="Chưa có môn học" />}
                        </QueryDetail>

                        <Text style={styles.section}>Bài tập đến hạn trong 7 ngày</Text>
                    </View>
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

const styles = StyleSheet.create({
    title: { ...typography.h2, color: colors.text, marginTop: spacing.md },
    section: { ...typography.h3, color: colors.text, marginTop: spacing.xl },
    text: { ...typography.body, color: colors.textMuted, marginVertical: spacing.sm },
    error: { ...typography.caption, color: colors.danger },
});