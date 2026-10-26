/**
 * @param {object} assignment - Bắt buộc
 * @param {Function} onPress - Bắt buộc
 * @param {Function} onToggleStatus - Bắt buộc
 */
import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import StatusToggle from './StatusToggle';
import SyncBadge from '../common/SyncBadge';
import { formatDate, isOverdue } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

function AssignmentItem({
    assignment,
    onPress,
    onToggleStatus,
    pending = false,
}) {
    return (
        <View style={styles.card}>
            <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Xem bài tập ${assignment.title}`}
                onPress={onPress}
                style={styles.content}>
                <Text style={styles.title}>{assignment.title}</Text>
                <Text style={styles.text}>
                    {assignment.course?.name || 'Môn học'}
                </Text>
                <Text style={[styles.text, isOverdue(assignment) && styles.overdue]}>
                    Hạn nộp: {formatDate(assignment.dueDate, 'datetime')}
                </Text>
            </Pressable>
            <StatusToggle status={assignment.status} onToggle={onToggleStatus} />
            <SyncBadge pending={pending} />
        </View>
    );
}

export default React.memo(AssignmentItem);

const styles = StyleSheet.create({
    card: {
        padding: spacing.lg,
        marginVertical: spacing.sm,
        backgroundColor: colors.surface,
        borderRadius: spacing.radius,
    },
    content: { minHeight: spacing.touch, gap: spacing.xs },
    title: { ...typography.h3, color: colors.text },
    text: { ...typography.body, color: colors.textMuted },
    overdue: { color: colors.danger },
});