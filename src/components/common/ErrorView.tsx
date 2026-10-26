/**
 * @param {string} message - Bắt buộc
 * @param {Function} onRetry - Bắt buộc
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppButton from './AppButton';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function ErrorView({ message, onRetry }) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>⚠ {message}</Text>
            <AppButton title="Thử lại" onPress={onRetry} variant="outline" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { paddingVertical: spacing.lg },
    text: { ...typography.body, color: colors.danger, marginBottom: spacing.sm },
});