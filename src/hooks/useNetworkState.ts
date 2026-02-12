import { useEffect, useMemo, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

export const useNetworkState = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [mockOffline, setMockOffline] = useState(false);

  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => {
      setIsOnline(Boolean(state.isConnected && state.isInternetReachable !== false));
    });
    return unsub;
  }, []);

  const offline = useMemo(() => !isOnline || mockOffline, [isOnline, mockOffline]);

  return {
    offline,
    isOnline,
    mockOffline,
    toggleMockOffline: () => setMockOffline((current) => !current)
  };
};
