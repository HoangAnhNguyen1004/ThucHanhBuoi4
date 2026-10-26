/**
 * @param {Array<{label:string,value:any}>} options - Bắt buộc
 * @param {*} selected - Bắt buộc
 * @param {Function} onSelect - Bắt buộc
 */
import React from 'react';
import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function FilterChips({ options, selected, onSelect }) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scroll}
            contentContainerStyle={styles.content}>
            {options.map(option => {
                const active = option.value === selected;

                return (
                    <Pressable
                        key={String(option.value)}
                        accessibilityRole="button"
                        accessibilityLabel={option.label}
                        accessibilityState={{ selected: active }}
                        onPress={() => onSelect(option.value)}
                        style={[styles.chip, active && styles.active]}>
                        <Text style={[styles.text, active && styles.activeText]}>
                            {option.label}
                        </Text>
                    </Pressable>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: { flexGrow: 0 },
    content: { gap: spacing.sm, paddingVertical: spacing.sm },
    chip: {
        minWidth: spacing.touch,
        minHeight: spacing.touch,
        justifyContent: 'center',
        paddingHorizontal: spacing.md,
        borderRadius: spacing.radius,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },
    active: { backgroundColor: colors.primary, borderColor: colors.primary },
    text: { ...typography.button, color: colors.text },
    activeText: { color: colors.white },
});