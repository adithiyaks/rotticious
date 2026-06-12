/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MenuCategory = 'Sips' | 'Bites' | 'Sweets' | 'Signatures';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: MenuCategory;
  price: string;
  rating: number;
  tags: string[];
  calories?: string;
  isPopular?: boolean;
}

export interface ScrollSection {
  id: number;
  title: string;
  subtitle: string;
  description?: string;
}

export const MENU_ITEMS: MenuItem[] = [
  // Sips
  {
    id: 'sip-1',
    name: 'Belan Espresso Tonic',
    description: 'Double shot of master-roast espresso floating over sparkling tonic water, cold-infused with orange peel essence.',
    category: 'Sips',
    price: '$6.50',
    rating: 4.9,
    tags: ['Signature', 'Cold', 'Spiced'],
    isPopular: true
  },
  {
    id: 'sip-2',
    name: 'Rose & Cardamom Latte',
    description: 'Smooth steamed milk infused with real organic rosewater syrup and crushed cardamom pods, combined with a sweet house espresso.',
    category: 'Sips',
    price: '$6.75',
    rating: 4.8,
    tags: ['Hot', 'Botanical', 'Floral']
  },
  {
    id: 'sip-3',
    name: 'Smoked Vanilla Cortado',
    description: 'Equal parts hand-pulled espresso and textured milk, sweetened with hand-scraped vanilla bean syrup and lightly cold-smoked.',
    category: 'Sips',
    price: '$5.50',
    rating: 4.9,
    tags: ['Hot', 'Rich', 'Smoky'],
    isPopular: true
  },
  {
    id: 'sip-4',
    name: 'Pistachio Matcha Cloud',
    description: 'Premium ceremonial grade matcha whisked to perfection, topped with a velvety layer of cold pistachio sweet cream foam.',
    category: 'Sips',
    price: '$7.00',
    rating: 4.7,
    tags: ['Cold', 'Healthy', 'Sweet Cream']
  },

  // Bites
  {
    id: 'bite-1',
    name: 'The Rotticious Truffle Burger',
    description: 'Flame-grilled prime blend beef patty, caramelized wild mushrooms, melted Swiss cheese, and high-infusion truffle aioli on a freshly baked brioche bun.',
    category: 'Bites',
    price: '$16.95',
    rating: 4.9,
    tags: ['Hot', 'Savory', 'House Special'],
    isPopular: true
  },
  {
    id: 'bite-2',
    name: 'Sourdough Avocado & Heirloom Poached',
    description: 'Fresh heritage sourdough toasted with extra virgin olive oil, smashed Haas avocado, organic heirloom cherry tomatoes, and local free-range poached eggs.',
    category: 'Bites',
    price: '$14.50',
    rating: 4.7,
    tags: ['Fresh', 'Superfood', 'Breakfast']
  },
  {
    id: 'bite-3',
    name: 'Pesto Chicken Pull-Apart Bread',
    description: 'Tender pulled rotisserie chicken, homemade pine nut and basil pesto, wrapped in layers of hand-laminated buttery dough, topped with molten mozzarella.',
    category: 'Bites',
    price: '$12.00',
    rating: 4.8,
    tags: ['Warm', 'Herbaceous', 'Craft Dough']
  },

  // Sweets
  {
    id: 'sweet-1',
    name: 'Golden Butter Saffron Croissant',
    description: 'A 27-layer precision fold butter croissant infused with premium Kashmiri saffron, baked to a glassy golden brown crunch.',
    category: 'Sweets',
    price: '$5.75',
    rating: 5.0,
    tags: ['Freshly Baked', 'Classic', 'Sweet-Scented'],
    isPopular: true
  },
  {
    id: 'sweet-2',
    name: 'Pistachio Custard Cruffin',
    description: 'Croissant-muffin hybrid hand-rolled in cardamom sugar, generously filled with a rich, velvety roasted pistachio bean pastry cream.',
    category: 'Sweets',
    price: '$6.50',
    rating: 4.9,
    tags: ['Decadent', 'Crunchy', 'House Classic']
  },
  {
    id: 'sweet-3',
    name: 'Cardamom Cinnamon Roll',
    description: 'Fluffy brioche dough swirled with spicy Saigon cinnamon, organic butter, and crushed cardamom seeds, finished with orange cream-cheese glaze.',
    category: 'Sweets',
    price: '$6.25',
    rating: 4.8,
    tags: ['Warm', 'Glazed', 'Spiced']
  },

  // Signatures
  {
    id: 'sig-1',
    name: 'The Belan Rolling Waffle',
    description: 'Thick, caramelized pearl-sugar Liege waffle pressed using our custom steel-cast rolling pin rollers, topped with fresh house-made clotted cream and fig compote.',
    category: 'Signatures',
    price: '$13.50',
    rating: 4.95,
    tags: ['Hot', 'Legendary', 'Unique Crust'],
    isPopular: true
  },
  {
    id: 'sig-2',
    name: 'Rotticious Smoked Hot Chocolate',
    description: 'A rich visual experience featuring 72% dark Venezuelan single-origin chocolate melted in fresh heavy cream, infused over warm oak smoke with burnt marshmallow.',
    category: 'Signatures',
    price: '$8.50',
    rating: 4.9,
    tags: ['Immersive', 'Dark Chocolate', 'House Specialty'],
    isPopular: true
  }
];

export const SCROLL_SECTIONS: ScrollSection[] = [
  {
    id: 1,
    title: 'The Origin of Flavor',
    subtitle: 'THE PERFECT BREW BEGINS',
    description: 'From slow-ripened organic coffee beans harvested at high elevations, selected with mathematical precision.'
  },
  {
    id: 2,
    title: 'The Alchemic Pour',
    subtitle: 'POUR INTO VIBE',
    description: 'Watch the pristine stream meet the warmth of the kiln-fired cup, setting a meditative sensory temperature.'
  },
  {
    id: 3,
    title: 'The Evolution',
    subtitle: 'AND ROLLS INTO FLAVOR',
    description: 'The cup transforms as craftmanship shifts shape, moving from fluid extraction to structural dough rolling.'
  },
  {
    id: 4,
    title: 'The Sacred Dough',
    subtitle: 'CRAFTING WITH PRESSURE',
    description: 'Our signature flour undergoes a 48-hour cold fermentation process, rolled under precise linear tension.'
  },
  {
    id: 5,
    title: 'The Broken Hearth',
    subtitle: 'EXPLORING MENU HORIZONS',
    description: 'As heat cures the dough, the plane splits open, revealing the core taste quadrants of our specialty cafe-bakery.'
  },
  {
    id: 6,
    title: 'Gastronomic Symphony',
    subtitle: 'THE ROTTICIOUS SPECIALS',
    description: 'Touch, select, and indulge in our interactive sensory dashboard. Every pastry, burger, and brew holds a story.'
  },
  {
    id: 7,
    title: 'Perfect Alignment',
    subtitle: 'ROTTICIOUS DESIGN SIGNATURE',
    description: 'Our logo stands as an oath. Real rolling pins, fresh roasted espresso, architectural comfort, and deep craftsmanship.'
  }
];
