/**
 * @param {object} grade - Bắt buộc
 * @param {Function} onPress - Bắt buộc
 */
import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

function GradeRow({ grade, onPress }) {
    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Xem điểm ${grade.course?.name || ''}`}
            onPress={onPress}
            style={styles.card}>
            <Text style={styles.title}>{grade.course?.name || 'Môn học'}</Text>
            <Text style={styles.text}>{grade.course?.credits || 0} tín chỉ</Text>
            <Text style={styles.score}>
                Tổng kết: {Number(grade.total).toFixed(2)} — {grade.letter}
            </Text>
        </Pressable>
    );
}

export default React.memo(GradeRow);

const styles = StyleSheet.create({
    card: {
        minHeight: spacing.touch,
        padding: spacing.lg,
        marginVertical: spacing.sm,
        borderRadius: spacing.radius,
        backgroundColor: colors.surface,
        gap: spacing.xs,
    },
    title: { ...typography.h3, color: colors.text },
    text: { ...typography.body, color: colors.textMuted },
    score: { ...typography.button, color: colors.primary },
});