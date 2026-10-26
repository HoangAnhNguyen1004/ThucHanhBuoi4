/**
 * @param {number} gpa - Bắt buộc
 * @param {number} totalCredits - Bắt buộc
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function GpaSummary({ gpa, totalCredits }) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>GPA: {Number(gpa).toFixed(2)} / 4.00</Text>
            <Text style={styles.text}>Tín chỉ tích lũy: {totalCredits}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.primary,
        padding: spacing.lg,
        borderRadius: spacing.radius,
        marginVertical: spacing.md,
    },
    title: { ...typography.h2, color: colors.white },
    text: { ...typography.body, color: colors.white, marginTop: spacing.sm },
});