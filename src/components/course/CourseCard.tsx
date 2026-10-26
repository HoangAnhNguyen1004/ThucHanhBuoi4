/**
 * @param {object} course - Bắt buộc
 * @param {Function} onPress - Bắt buộc
 */
import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

function CourseCard({ course, onPress }) {
    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Xem môn ${course.name}`}
            onPress={onPress}
            style={styles.card}>
            <Text style={styles.code}>{course.code}</Text>
            <Text style={styles.title}>{course.name}</Text>
            <Text style={styles.text}>{course.credits} tín chỉ</Text>
            <Text style={styles.text}>{course.lecturer}</Text>
        </Pressable>
    );
}

export default React.memo(CourseCard);

const styles = StyleSheet.create({
    card: {
        minHeight: spacing.touch,
        padding: spacing.lg,
        marginVertical: spacing.sm,
        borderRadius: spacing.radius,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        gap: spacing.xs,
    },
    code: { ...typography.caption, color: colors.primary },
    title: { ...typography.h3, color: colors.text },
    text: { ...typography.body, color: colors.textMuted },
});