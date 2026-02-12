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

export const products: Product[] = [
  {
    id: '123',
    name: 'Chateau Leoville-Las Cases Saint-Julien',
    region: 'Bordeaux',
    country: 'France',
    year: 2020,
    rating: 4.7,
    reviewCount: 128,
    price: 1800,
    description:
      'A structured and elegant red with cassis, cedar, graphite, and a long savory finish. Built for celebratory dinners and milestone toasts.',
    tastingNotes: ['Blackcurrant', 'Cedar', 'Graphite', 'Leather', 'Long dry finish'],
    foodPairing: ['Dry-aged ribeye', 'Lamb shoulder', 'Aged hard cheese'],
    images: [
      require('../../assets/images/product-1.png'),
      require('../../assets/images/product-2.png'),
      require('../../assets/images/product-3.png')
    ]
  },
  {
    id: '456',
    name: 'Domaine Robert Groffier Chambolle-Musigny',
    region: 'Burgundy',
    country: 'France',
    year: 2021,
    rating: 4.5,
    reviewCount: 76,
    price: 2489,
    description:
      'A silky Pinot Noir with vivid cherry fruit, floral perfume, and polished tannins. Refined enough for anniversaries and intimate pairings.',
    tastingNotes: ['Wild cherry', 'Rose petals', 'Baking spice', 'Silky texture'],
    foodPairing: ['Duck breast', 'Mushroom risotto', 'Soft-rind cheese'],
    images: [
      require('../../assets/images/product-2.png'),
      require('../../assets/images/product-3.png'),
      require('../../assets/images/product-1.png')
    ]
  }
];

export const productById = (id: string) => products.find((product) => product.id === id) ?? products[0];

export const formatHkd = (price: number) => `HK$ ${price.toLocaleString('en-US')}`;
