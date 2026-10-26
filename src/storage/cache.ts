import AsyncStorage from '@react-native-async-storage/async-storage';
import { cacheKey } from './keys';

export async function getCache(key) {
    const raw = await AsyncStorage.getItem(cacheKey(key));

    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export async function setCache(key, data, savedAt = new Date().toISOString()) {
    const entry = { data, savedAt };

    await AsyncStorage.setItem(cacheKey(key), JSON.stringify(entry));

    return entry;
}