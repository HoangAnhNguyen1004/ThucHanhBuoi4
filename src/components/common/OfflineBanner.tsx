import React from 'react';
import { Text, StyleSheet } from 'react-native';
import useNetworkStatus from '../../hooks/useNetworkStatus';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function OfflineBanner() {
    const { isOnline } = useNetworkStatus();

    if (isOnline) {
        return null;
    }

    return <Text style={styles.banner}>Bạn đang offline</Text>;
}

const styles = StyleSheet.create({
    banner: {
        ...typography.body,
        color: colors.warning,
        backgroundColor: colors.warningBackground,
        padding: spacing.sm,
        textAlign: 'center',
    },
});