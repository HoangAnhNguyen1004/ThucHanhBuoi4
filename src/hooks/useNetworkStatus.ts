import { useNetInfo } from '@react-native-community/netinfo';

export default function useNetworkStatus() {
    const network = useNetInfo();

    return {
        isOnline:
            network.isConnected === true &&
            network.isInternetReachable !== false,
    };
}