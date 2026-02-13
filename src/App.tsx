import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useNetworkState } from "./hooks/useNetworkState";
import { RootNavigator } from "./navigation/RootNavigator";

export default function App() {
  const { offline, mockOffline, toggleMockOffline } = useNetworkState();

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <RootNavigator
        mockOffline={mockOffline}
        offline={offline}
        onToggleMockOffline={toggleMockOffline}
      />
    </SafeAreaProvider>
  );
}
