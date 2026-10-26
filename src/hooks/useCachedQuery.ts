import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { CACHE_TTL } from '../config';
import useNetworkStatus from './useNetworkStatus';
import {
    subscribe,
    getVersion,
    queryEntry,
    visibleData,
    loadQuery,
    setOnline,
} from './dataStore';

export default function useCachedQuery(key, fetcher) {
    useSyncExternalStore(subscribe, getVersion, getVersion);

    const { isOnline } = useNetworkStatus();
    const entry = queryEntry(key);

    useEffect(() => {
        setOnline(isOnline);
        loadQuery(key, fetcher);
    }, [key, fetcher, isOnline]);

    const refresh = useCallback(
        () => loadQuery(key, fetcher, true),
        [key, fetcher],
    );

    return {
        data: visibleData(key),
        loading: entry.loading,
        error: entry.error,
        refreshing: entry.refreshing,
        lastUpdated: entry.savedAt,
        stale:
            !entry.savedAt ||
            Date.now() - new Date(entry.savedAt).getTime() > CACHE_TTL,
        refresh,
    };
}