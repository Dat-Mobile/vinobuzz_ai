import { Feather, Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, radius, spacing } from "../constants/theme";
import { formatHkd, Product } from "../data/products";

type ProductCardProps = {
  product: Product;
  onPressView: (id: string) => void;
};

export const ProductCard = ({ product, onPressView }: ProductCardProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={() => onPressView(product.id)}
      style={styles.card}
    >
      <Image source={product.images[0]} style={styles.image} />
      <View style={styles.content}>
        <Text numberOfLines={2} style={styles.name}>
          {product.name} {product.year}
        </Text>
        <Text style={styles.subtitle}>
          {product.region}, {product.country}
        </Text>

        <View style={styles.ratingRow}>
          <Ionicons color={colors.brand} name="star" size={14} />
          <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
          <Text style={styles.reviewCount}>({product.reviewCount})</Text>
        </View>

        <Text numberOfLines={2} style={styles.description}>
          {product.description}
        </Text>

        <View style={styles.bottomRow}>
          <Text style={styles.price}>{formatHkd(product.price)}</Text>
          <View style={styles.actionButton}>
            <Feather color={colors.white} name="arrow-up-right" size={15} />
            <Text style={styles.actionText}>View Details</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
  },
  image: {
    backgroundColor: "#EEE7E0",
    height: 168,
    width: 128,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  name: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "800",
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "500",
  },
  ratingRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  ratingText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "700",
  },
  reviewCount: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  bottomRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.xs,
  },
  price: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "900",
  },
  actionButton: {
    alignItems: "center",
    backgroundColor: colors.brand,
    borderRadius: radius.pill,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actionText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "800",
  },
});
