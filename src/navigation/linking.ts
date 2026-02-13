import { getStateFromPath as defaultGetStateFromPath, LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { RootStackParamList } from "../types/navigation";

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL("/"), "vinobuzz://"],
  config: {
    screens: {
      Home: "",
      ProductDetail: "product/:productId",
    },
  },
  getStateFromPath: (path, options) => {
    // Accept both vinobuzz://product/123 and vinobuzz://123 style inputs.
    const segments = path.split("/").filter(Boolean);
    if (segments.length === 1 && segments[0] !== "home") {
      return defaultGetStateFromPath(`product/${segments[0]}`, options);
    }
    return defaultGetStateFromPath(path, options);
  },
};
