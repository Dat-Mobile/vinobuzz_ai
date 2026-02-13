import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ListRenderItem,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProductSkeleton } from "../components/ProductSkeleton";
import { colors, radius, spacing, typography } from "../constants/theme";
import { openChatOverlay } from "../controllers/chatOverlay";
import { Product, formatHkd, productById } from "../data/products";
import { RootStackParamList } from "../types/navigation";

type ProductDetailProps = NativeStackScreenProps<
  RootStackParamList,
  "ProductDetail"
>;

const screenWidth = Dimensions.get("window").width;

type ProductDetailContentProps = ProductDetailProps & {
  offline: boolean;
};

export const ProductDetailScreen = ({
  route,
  navigation,
  offline,
}: ProductDetailContentProps) => {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const listRef = useRef<FlatList<number>>(null);

  const product = useMemo<Product>(
    () => productById(route.params.productId),
    [route.params.productId],
  );
  const insetStyles = useMemo(
    () =>
      StyleSheet.create({
        stickyCtaInset: { paddingBottom: 12 + insets.bottom },
      }),
    [insets.bottom],
  );

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [route.params.productId]);

  const renderImage: ListRenderItem<number> = ({ item }) => {
    return (
      <View style={styles.gallerySlide}>
        <Image source={item} style={styles.galleryImage} />
      </View>
    );
  };

  const changeQuantity = (delta: number) => {
    setQuantity((current) => {
      const next = current + delta;
      if (next < 1) {
        return 1;
      }
      if (next > 9) {
        return 9;
      }
      return next;
    });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ProductSkeleton />
      ) : (
        <>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.headerRow}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <MaterialCommunityIcons
                  color={colors.textPrimary}
                  name="arrow-left"
                  size={22}
                />
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.88}
                onPress={openChatOverlay}
                style={styles.askButton}
              >
                <MaterialCommunityIcons
                  color={colors.white}
                  name="chat-processing-outline"
                  size={18}
                />
                <Text style={styles.askButtonText}>Ask VinoBuzz</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={product.images}
              horizontal
              keyExtractor={(item, index) => `${item}-${index}`}
              pagingEnabled
              ref={listRef}
              renderItem={renderImage}
              showsHorizontalScrollIndicator={false}
            />

            <View style={styles.body}>
              {route.params.fromChat ? (
                <Text style={styles.chatHint}>
                  Opened from chat recommendation
                </Text>
              ) : null}
              <Text style={styles.name}>
                {product.name} {product.year}
              </Text>
              <Text style={styles.meta}>
                {product.region}, {product.country}
              </Text>

              <View style={styles.ratingRow}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <MaterialCommunityIcons
                    color={index < 4 ? colors.brand : "#D6CDC5"}
                    key={`star-${index}`}
                    name="star"
                    size={16}
                  />
                ))}
                <Text style={styles.ratingText}>
                  {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                </Text>
              </View>

              <Text style={styles.price}>{formatHkd(product.price)}</Text>
              <Text style={styles.description}>{product.description}</Text>

              <TouchableOpacity
                onPress={() => setExpanded((current) => !current)}
                style={styles.expandHeader}
              >
                <Text style={styles.expandTitle}>Tasting Notes</Text>
                <MaterialCommunityIcons
                  color={colors.textPrimary}
                  name={expanded ? "chevron-up" : "chevron-down"}
                  size={20}
                />
              </TouchableOpacity>

              {expanded ? (
                <View style={styles.expandBody}>
                  {product.tastingNotes.map((note) => (
                    <View key={note} style={styles.noteRow}>
                      <View style={styles.noteDot} />
                      <Text style={styles.noteText}>{note}</Text>
                    </View>
                  ))}

                  <Text style={styles.foodHeading}>Food Pairing</Text>
                  {product.foodPairing.map((item) => (
                    <Text key={item} style={styles.foodText}>
                      • {item}
                    </Text>
                  ))}
                </View>
              ) : null}

              <View style={styles.spacer} />
            </View>
          </ScrollView>

          <LinearGradient
            colors={["rgba(246,241,235,0)", "rgba(246,241,235,0.95)"]}
            style={styles.ctaShadow}
          />

          <View style={[styles.stickyCta, insetStyles.stickyCtaInset]}>
            <View style={styles.quantityPill}>
              <TouchableOpacity
                onPress={() => changeQuantity(-1)}
                style={styles.qtyButton}
              >
                <MaterialCommunityIcons
                  color={colors.textPrimary}
                  name="minus"
                  size={20}
                />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity
                onPress={() => changeQuantity(1)}
                style={styles.qtyButton}
              >
                <MaterialCommunityIcons
                  color={colors.textPrimary}
                  name="plus"
                  size={20}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              disabled={offline}
              style={[styles.addButton, offline && styles.addButtonDisabled]}
            >
              <Text style={styles.addButtonText}>
                {offline ? "Unavailable Offline" : "Add To Cart"}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    paddingBottom: 140,
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  backButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  backText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "700",
  },
  askButton: {
    alignItems: "center",
    backgroundColor: colors.brand,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.brand,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.24,
    shadowRadius: 18,
  },
  askButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
  gallerySlide: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    width: screenWidth,
  },
  galleryImage: {
    backgroundColor: "#ECE4DB",
    borderRadius: radius.lg,
    height: 360,
    width: "100%",
  },
  body: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  chatHint: {
    color: colors.brandDark,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: spacing.xs,
    textTransform: "uppercase",
  },
  name: {
    color: colors.textPrimary,
    fontSize: typography.title,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  meta: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  ratingRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 3,
    marginTop: spacing.sm,
  },
  ratingText: {
    color: colors.textSecondary,
    fontSize: 13,
    marginLeft: 6,
  },
  price: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: "900",
    marginTop: spacing.sm,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  expandHeader: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 13,
  },
  expandTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "800",
  },
  expandBody: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: radius.md,
    borderBottomRightRadius: radius.md,
    borderColor: colors.border,
    borderTopWidth: 0,
    borderWidth: 1,
    marginTop: -2,
    padding: spacing.md,
  },
  noteRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  noteDot: {
    backgroundColor: colors.brand,
    borderRadius: 999,
    height: 7,
    width: 7,
  },
  noteText: {
    color: colors.textPrimary,
    fontSize: 14,
  },
  foodHeading: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "800",
    marginTop: spacing.sm,
  },
  foodText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 21,
  },
  spacer: {
    height: 50,
  },
  ctaShadow: {
    bottom: 86,
    height: 80,
    left: 0,
    position: "absolute",
    right: 0,
  },
  stickyCta: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    bottom: 0,
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    position: "absolute",
    width: "100%",
  },
  quantityPill: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  qtyButton: {
    alignItems: "center",
    height: 28,
    justifyContent: "center",
    width: 28,
  },
  qtyText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "800",
    minWidth: 20,
    textAlign: "center",
  },
  addButton: {
    alignItems: "center",
    backgroundColor: colors.brand,
    borderRadius: radius.pill,
    flex: 1,
    justifyContent: "center",
    minHeight: 50,
    paddingHorizontal: 16,
  },
  addButtonDisabled: {
    backgroundColor: "#B3A8A0",
  },
  addButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "900",
  },
});
