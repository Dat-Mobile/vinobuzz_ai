export type Product = {
  id: string;
  name: string;
  region: string;
  country: string;
  year: number;
  rating: number;
  reviewCount: number;
  price: number;
  description: string;
  tastingNotes: string[];
  foodPairing: string[];
  images: number[];
};

const productImages = {
  wine1: require("../../assets/images/products/wine-1.png"),
  wine2: require("../../assets/images/products/wine-2.png"),
  wine3: require("../../assets/images/products/wine-3.png"),
  wine4: require("../../assets/images/products/wine-4.jpeg"),
  wine5: require("../../assets/images/products/wine-5.jpeg"),
  wine6: require("../../assets/images/products/wine-6.jpeg"),
};

export const products: Product[] = [
  {
    id: "123",
    name: "Chateau Leoville-Las Cases Saint-Julien",
    region: "Bordeaux",
    country: "France",
    year: 2020,
    rating: 4.7,
    reviewCount: 128,
    price: 1800,
    description:
      "A structured and elegant red with cassis, cedar, graphite, and a long savory finish. Built for celebratory dinners and milestone toasts.",
    tastingNotes: [
      "Blackcurrant",
      "Cedar",
      "Graphite",
      "Leather",
      "Long dry finish",
    ],
    foodPairing: ["Dry-aged ribeye", "Lamb shoulder", "Aged hard cheese"],
    images: [productImages.wine1, productImages.wine4, productImages.wine2],
  },
  {
    id: "456",
    name: "Domaine Robert Groffier Chambolle-Musigny",
    region: "Burgundy",
    country: "France",
    year: 2021,
    rating: 4.5,
    reviewCount: 76,
    price: 2489,
    description:
      "A silky Pinot Noir with vivid cherry fruit, floral perfume, and polished tannins. Refined enough for anniversaries and intimate pairings.",
    tastingNotes: [
      "Wild cherry",
      "Rose petals",
      "Baking spice",
      "Silky texture",
    ],
    foodPairing: ["Duck breast", "Mushroom risotto", "Soft-rind cheese"],
    images: [productImages.wine4, productImages.wine2, productImages.wine5],
  },
  {
    id: "789",
    name: "Chateau Duroc Reserve",
    region: "Medoc",
    country: "France",
    year: 2019,
    rating: 4.6,
    reviewCount: 94,
    price: 1980,
    description:
      "A polished Bordeaux blend with cassis, toasted oak, and graphite depth. Designed for formal dinners and business celebrations.",
    tastingNotes: ["Cassis", "Cedar", "Graphite", "Toasted oak"],
    foodPairing: ["Prime rib", "Roasted lamb", "Comte cheese"],
    images: [productImages.wine2, productImages.wine1, productImages.wine3],
  },
  {
    id: "101",
    name: "Domaine Cote Noire Prestige",
    region: "Cote de Nuits",
    country: "France",
    year: 2020,
    rating: 4.4,
    reviewCount: 61,
    price: 2190,
    description:
      "An elegant Pinot Noir profile with red berry perfume, silky texture, and a clean mineral finish for refined pairings.",
    tastingNotes: ["Red cherry", "Violet", "Mineral", "Soft spice"],
    foodPairing: ["Duck confit", "Mushroom tart", "Brie"],
    images: [productImages.wine5, productImages.wine4, productImages.wine6],
  },
  {
    id: "202",
    name: "Reserve Saint-Julien Collection",
    region: "Saint-Julien",
    country: "France",
    year: 2018,
    rating: 4.5,
    reviewCount: 83,
    price: 1760,
    description:
      "A confident and balanced Saint-Julien with dark fruit concentration, fine tannins, and a long savory finish.",
    tastingNotes: ["Blackberry", "Leather", "Graphite", "Dry finish"],
    foodPairing: ["Beef short rib", "Venison", "Aged cheddar"],
    images: [productImages.wine3, productImages.wine1, productImages.wine2],
  },
  {
    id: "303",
    name: "Cuvée Heritage Pinot Selection",
    region: "Burgundy",
    country: "France",
    year: 2021,
    rating: 4.3,
    reviewCount: 57,
    price: 2090,
    description:
      "A graceful and expressive Pinot with bright fruit and nuanced earthiness, crafted for intimate celebrations.",
    tastingNotes: ["Strawberry", "Rose", "Forest floor", "Silky finish"],
    foodPairing: ["Roast chicken", "Truffle pasta", "Camembert"],
    images: [productImages.wine6, productImages.wine5, productImages.wine4],
  },
];

export const productById = (id: string) =>
  products.find((product) => product.id === id) ?? products[0];

export const formatHkd = (price: number) =>
  `HK$ ${price.toLocaleString("en-US")}`;
