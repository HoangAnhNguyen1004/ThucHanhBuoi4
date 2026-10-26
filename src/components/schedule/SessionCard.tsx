/**
 * @param {object} session - Bắt buộc
 * @param {Function} onPress - Bắt buộc
 */
import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

function SessionCard({ session, onPress }) {
    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Xem buổi học ${session.course?.name || ''}`}
            onPress={onPress}
            style={styles.card}>
            <Text style={styles.title}>
                {session.course?.name || 'Môn học'}
            </Text>
            <Text style={styles.time}>
                {session.startTime} – {session.endTime}
            </Text>
            <Text style={styles.text}>Phòng: {session.room}</Text>
        </Pressable>
    );
}

export default React.memo(SessionCard);

const styles = StyleSheet.create({
    card: {
        minHeight: spacing.touch,
        padding: spacing.lg,
        marginVertical: spacing.sm,
        backgroundColor: colors.surface,
        borderRadius: spacing.radius,
        gap: spacing.xs,
    },
    title: { ...typography.h3, color: colors.text },
    time: { ...typography.body, color: colors.primary },
    text: { ...typography.body, color: colors.textMuted },
});