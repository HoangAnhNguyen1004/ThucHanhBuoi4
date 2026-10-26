/**
 * @param {string} value - Bắt buộc
 * @param {Function} onChangeText - Bắt buộc
 */
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import AppButton from './AppButton';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function SearchBar({
    value,
    onChangeText,
    placeholder = 'Tìm môn học…',
}) {
    return (
        <View style={styles.container}>
            <TextInput
                accessibilityLabel={placeholder}
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.textMuted}
            />
            {value ? (
                <AppButton
                    title="Xóa"
                    variant="outline"
                    onPress={() => onChangeText('')}
                />
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginVertical: spacing.sm,
    },
    input: {
        ...typography.body,
        flex: 1,
        minHeight: spacing.touch,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: spacing.radius,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.surface,
        color: colors.text,
    },
});