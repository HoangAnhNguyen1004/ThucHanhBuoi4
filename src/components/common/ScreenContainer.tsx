/** @param {React.ReactNode} children - Bắt buộc */
import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OfflineBanner from './OfflineBanner';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

export default function ScreenContainer({ children, scroll = false }) {
    return (
        <SafeAreaView style={styles.screen} edges={['left', 'right', 'bottom']}>
            <OfflineBanner />
            {scroll ? (
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.content}>
                    {children}
                </ScrollView>
            ) : (
                <View style={styles.body}>{children}</View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    body: { flex: 1, paddingHorizontal: spacing.lg },
    content: { padding: spacing.lg, flexGrow: 1 },
});