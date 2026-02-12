import {
  DefaultTheme,
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChatOverlay } from "../components/ChatOverlay";
import { colors } from "../constants/theme";
import { HomeScreen } from "../screens/HomeScreen";
import { ProductDetailScreen } from "../screens/ProductDetailScreen";
import { RootStackParamList } from "../types/navigation";
import { linking } from "./linking";

const Stack = createNativeStackNavigator<RootStackParamList>();
const navigationRef = createNavigationContainerRef<RootStackParamList>();

type RootNavigatorProps = {
  offline: boolean;
  mockOffline: boolean;
  onToggleMockOffline: () => void;
};

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.border,
    primary: colors.brand,
  },
};

export const RootNavigator = ({
  offline,
  mockOffline,
  onToggleMockOffline,
}: RootNavigatorProps) => {
  const onViewProductFromChat = (productId: string) => {
    if (!navigationRef.isReady()) {
      return;
    }

    navigationRef.navigate("ProductDetail", { productId, fromChat: true });
  };

  return (
    <SafeAreaView
      edges={["top"]}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <View style={{ flex: 1 }}>
        <NavigationContainer
          linking={linking}
          ref={navigationRef}
          theme={navTheme}
        >
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          >
            <Stack.Screen name="Home">
              {(props) => (
                <HomeScreen
                  {...props}
                  mockOffline={mockOffline}
                  offline={offline}
                  onToggleMockOffline={onToggleMockOffline}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="ProductDetail">
              {(props) => <ProductDetailScreen {...props} offline={offline} />}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>

        <ChatOverlay onViewProduct={onViewProductFromChat} />
      </View>
    </SafeAreaView>
  );
};
