import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { OfflineBanner } from '../components/OfflineBanner';
import { ProductCard } from '../components/ProductCard';
import { colors, radius, spacing, typography } from '../constants/theme';
import { products } from '../data/products';
import { RootStackParamList } from '../types/navigation';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

type HomeScreenContentProps = HomeScreenProps & {
  offline: boolean;
  mockOffline: boolean;
  onToggleMockOffline: () => void;
};

const heroImage = require('../../assets/images/hero-bg.png');
const promoImage = require('../../assets/images/promo-bg.png');

export const HomeScreen = ({
  navigation,
  offline,
  mockOffline,
  onToggleMockOffline
}: HomeScreenContentProps) => {
  const viewProduct = (productId: string, fromChat = false) => {
    navigation.navigate('ProductDetail', { productId, fromChat });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ImageBackground source={heroImage} style={styles.hero}>
          <LinearGradient colors={['rgba(10, 4, 2, 0.15)', 'rgba(10, 4, 2, 0.65)']} style={styles.heroOverlay}>
            <Text style={styles.heroEyebrow}>VinoBuzz AI Sommelier</Text>
            <Text style={styles.heroTitle}>AI For The{`\n`}Art Of Wine</Text>
            <Text style={styles.heroBody}>
              Discover tailored recommendations in seconds, from cellar classics to celebratory bottles.
            </Text>
            <TouchableOpacity style={styles.heroButton}>
              <Text style={styles.heroButtonText}>Start Tasting</Text>
            </TouchableOpacity>
          </LinearGradient>
        </ImageBackground>

        <View style={styles.section}>
          <OfflineBanner
            mockOffline={mockOffline}
            offline={offline}
            onToggleMockOffline={onToggleMockOffline}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggested Wine</Text>
          <Text style={styles.sectionSub}>Based on your latest chat preferences and event context.</Text>
          <View style={styles.cardList}>
            {products.map((product) => (
              <ProductCard key={product.id} onPressView={viewProduct} product={product} />
            ))}
          </View>
        </View>

        <ImageBackground source={promoImage} style={styles.promoCard}>
          <LinearGradient colors={['rgba(192,22,103,0.88)', 'rgba(143,17,77,0.9)']} style={styles.promoOverlay}>
            <Text style={styles.promoTitle}>Member Moments</Text>
            <Text style={styles.promoBody}>
              Trusted merchant inventory, loyalty rewards, and curated pairings for every celebration.
            </Text>
          </LinearGradient>
        </ImageBackground>

        <View style={styles.sectionBottomSpace} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1
  },
  content: {
    gap: spacing.lg,
    paddingBottom: 100
  },
  hero: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    height: 420,
    overflow: 'hidden'
  },
  heroOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing.lg
  },
  heroEyebrow: {
    color: '#F5D9E8',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase'
  },
  heroTitle: {
    color: colors.white,
    fontSize: typography.hero,
    fontWeight: '900',
    letterSpacing: -0.8,
    lineHeight: 44,
    marginTop: spacing.xs,
    textTransform: 'uppercase'
  },
  heroBody: {
    color: '#F8E9F0',
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.sm,
    maxWidth: 320
  },
  heroButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.brand,
    borderRadius: radius.pill,
    marginTop: spacing.md,
    paddingHorizontal: 22,
    paddingVertical: 12
  },
  heroButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800'
  },
  section: {
    gap: 8,
    paddingHorizontal: spacing.md
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.section,
    fontWeight: '900'
  },
  sectionSub: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20
  },
  cardList: {
    gap: spacing.md,
    marginTop: spacing.sm
  },
  promoCard: {
    borderRadius: 24,
    height: 210,
    marginHorizontal: spacing.md,
    overflow: 'hidden'
  },
  promoOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing.lg
  },
  promoTitle: {
    color: colors.white,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
    textTransform: 'uppercase'
  },
  promoBody: {
    color: '#F8E9F0',
    fontSize: 13,
    lineHeight: 20,
    marginTop: spacing.xs
  },
  sectionBottomSpace: {
    height: 50
  }
});
