import { useEffect, useSyncExternalStore } from 'react';
import { Alert, AppState } from 'react-native';
import useNetworkStatus from './useNetworkStatus';
import {
    subscribe,
    getVersion,
    initialize,
    setOnline,
    getSyncState,
    syncNow,
} from './dataStore';

export default function useOutboxSync() {
    useSyncExternalStore(subscribe, getVersion, getVersion);

    const { isOnline } = useNetworkStatus();
    const state = getSyncState();

    useEffect(() => {
        setOnline(isOnline);

        const attempt = () => {
            initialize()
                .then(() => {
                    if (isOnline) {
                        return syncNow();
                    }
                })
                .catch(() => { });
        };

        attempt();

        if (!isOnline) {
            return undefined;
        }

        const timer = setInterval(attempt, 15000);
        const subscription = AppState.addEventListener('change', next => {
            if (next === 'active') {
                attempt();
            }
        });

        return () => {
            clearInterval(timer);
            subscription.remove();
        };
    }, [isOnline]);

    useEffect(() => {
        if (state.notice) {
            Alert.alert('Đồng bộ dữ liệu', state.notice.message);
        }
    }, [state.notice]);

    return { ...state, isOnline, syncNow };
}
