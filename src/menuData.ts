/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Rotticious Menu Data — Royapettah Branch
 * Source: Zomato listing (manually curated)
 * Address: 10, Thiru Vika Road, PVR Sathyam Cinemas, Royapettah, Chennai
 * Hours: 9:15am – 10:30pm
 * Phone: +91 44 4855 5563
 *
 * ⚠️  PRICES ARE ESTIMATED — update priceRaw (INR) to match actual menu
 *     To update: edit the arrays below, one item per entry
 */

import type { MenuCategory } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// Sub-category type (the 12 Zomato sections)
// ─────────────────────────────────────────────────────────────────────────────
export type MenuSubCategory =
  | 'Hot Coffee'
  | 'Cold Coffee'
  | 'Blended Coffee'
  | 'Thickshake'
  | 'Fizzy & Slushy'
  | 'Appetizers'
  | 'Sandwiches'
  | 'Chicken Steaks'
  | 'Burgers'
  | 'Pasta'
  | 'Pizza'
  | 'Desserts';

// Subcategory → main category mapping (for cart + existing site integration)
export const SUBCAT_TO_MAIN: Record<MenuSubCategory, MenuCategory> = {
  'Hot Coffee':     'Sips',
  'Cold Coffee':    'Sips',
  'Blended Coffee': 'Sips',
  'Thickshake':     'Sips',
  'Fizzy & Slushy': 'Sips',
  'Appetizers':     'Bites',
  'Sandwiches':     'Bites',
  'Chicken Steaks': 'Bites',
  'Burgers':        'Signatures',
  'Pasta':          'Signatures',
  'Pizza':          'Signatures',
  'Desserts':       'Sweets',
};

// Accent color per sub-category (for gradient placeholders)
export const SUBCAT_COLOR: Record<MenuSubCategory, string> = {
  'Hot Coffee':     '#D2A078',
  'Cold Coffee':    '#7BA8C4',
  'Blended Coffee': '#8B7355',
  'Thickshake':     '#C4888A',
  'Fizzy & Slushy': '#6FAF8A',
  'Appetizers':     '#C4A87B',
  'Sandwiches':     '#B8A882',
  'Chicken Steaks': '#C47B7B',
  'Burgers':        '#C49B7B',
  'Pasta':          '#D4B896',
  'Pizza':          '#C4877B',
  'Desserts':       '#8B7B6E',
};

export interface RotticiousMenuItem {
  id: string;
  name: string;
  description: string;
  subcategory: MenuSubCategory;
  category: MenuCategory;          // derived field kept for compat
  price: string;                   // formatted display price
  priceRaw: number;                // numeric INR for cart math
  rating: number;
  tags: string[];
  image?: string;                  // path to /public/ asset (optional)
  isPopular?: boolean;
  available?: boolean;             // false = "Sold Out"
  isVeg?: boolean;                 // true = green dot
}

// ─────────────────────────────────────────────────────────────────────────────
// HOT COFFEE (10)
// ─────────────────────────────────────────────────────────────────────────────
const HOT_COFFEE: RotticiousMenuItem[] = [
  { id: 'hc-1', name: 'Americano', description: 'Espresso with hot water. Smooth and bold, just a bit more chill.', subcategory: 'Hot Coffee', category: 'Sips', price: '₹180', priceRaw: 180, rating: 4.5, tags: ['Hot', 'Bold', 'Classic'], isVeg: true },
  { id: 'hc-2', name: 'Irish Hot Coffee', description: 'Water Based: Americano with Irish coffee flavour. No alcohol.', subcategory: 'Hot Coffee', category: 'Sips', price: '₹200', priceRaw: 200, rating: 4.5, tags: ['Hot', 'Flavoured', 'No Alcohol'], isVeg: true },
  { id: 'hc-3', name: 'Cappuccino', description: 'Espresso with milk foam. Fluffy on top.', subcategory: 'Hot Coffee', category: 'Sips', price: '₹200', priceRaw: 200, rating: 4.6, tags: ['Hot', 'Frothy', 'Creamy'], isVeg: true },
  { id: 'hc-4', name: 'Cafe Latte', description: 'Espresso with more milk than usual.', subcategory: 'Hot Coffee', category: 'Sips', price: '₹220', priceRaw: 220, rating: 4.6, tags: ['Hot', 'Milky', 'Smooth'], isVeg: true },
  { id: 'hc-5', name: 'Flat White', description: 'Double espresso and milk.', subcategory: 'Hot Coffee', category: 'Sips', price: '₹220', priceRaw: 220, rating: 4.5, tags: ['Hot', 'Strong', 'Silky'], isVeg: true },
  { id: 'hc-6', name: 'Mint Mocha', description: 'Coffee with chocolate and mint.', subcategory: 'Hot Coffee', category: 'Sips', price: '₹240', priceRaw: 240, rating: 4.6, tags: ['Hot', 'Mint', 'Chocolate'], isVeg: true },
  { id: 'hc-7', name: 'Cafe Mocha', description: 'Coffee with chocolate.', subcategory: 'Hot Coffee', category: 'Sips', price: '₹240', priceRaw: 240, rating: 4.7, tags: ['Hot', 'Chocolate', 'Indulgent'], isVeg: true },
  { id: 'hc-8', name: 'Latte Macchiato', description: 'Milk with a splash of espresso.', subcategory: 'Hot Coffee', category: 'Sips', price: '₹240', priceRaw: 240, rating: 4.5, tags: ['Hot', 'Layered', 'Milky'], isVeg: true },
  { id: 'hc-9', name: 'Hot Spanish Latte', description: 'Velvety espresso meets sweet condensed milk for a rich, regal sip.', subcategory: 'Hot Coffee', category: 'Sips', price: '₹260', priceRaw: 260, rating: 4.8, tags: ['Hot', 'Sweet', 'Condensed Milk'], isVeg: true, isPopular: true },
  { id: 'hc-10', name: 'Hot Turkish Latte', description: 'A chilled, creamy indulgence with bold espresso and royal sweetness.', subcategory: 'Hot Coffee', category: 'Sips', price: '₹260', priceRaw: 260, rating: 4.7, tags: ['Hot', 'Rich', 'Royal'], isVeg: true },
];

// ─────────────────────────────────────────────────────────────────────────────
// ON THE ROCKS — COLD COFFEE (7)
// ─────────────────────────────────────────────────────────────────────────────
const COLD_COFFEE: RotticiousMenuItem[] = [
  { id: 'cc-1', name: 'Iced Americano', description: 'Espresso with cold water and ice.', subcategory: 'Cold Coffee', category: 'Sips', price: '₹200', priceRaw: 200, rating: 4.6, tags: ['Cold', 'Bold', 'Refreshing'], isVeg: true },
  { id: 'cc-2', name: 'Iced Latte', description: 'Espresso with cold milk and ice.', subcategory: 'Cold Coffee', category: 'Sips', price: '₹240', priceRaw: 240, rating: 4.7, tags: ['Cold', 'Milky', 'Smooth'], isVeg: true },
  { id: 'cc-3', name: 'Iced Spanish Latte', description: 'Velvety espresso meets sweet condensed milk for a rich, regal sip.', subcategory: 'Cold Coffee', category: 'Sips', price: '₹280', priceRaw: 280, rating: 4.8, tags: ['Cold', 'Sweet', 'Condensed Milk'], isVeg: true, isPopular: true },
  { id: 'cc-4', name: 'Iced Turkish Latte', description: 'A chilled, creamy indulgence with bold espresso and royal sweetness.', subcategory: 'Cold Coffee', category: 'Sips', price: '₹280', priceRaw: 280, rating: 4.7, tags: ['Cold', 'Rich', 'Royal'], isVeg: true, image: '/sip_espresso_tonic.png' },
  { id: 'cc-5', name: 'Iced Salted Caramel Latte', description: 'Cold latte with salted caramel.', subcategory: 'Cold Coffee', category: 'Sips', price: '₹300', priceRaw: 300, rating: 4.7, tags: ['Cold', 'Caramel', 'Sweet-Salty'], isVeg: true, isPopular: true },
  { id: 'cc-6', name: 'Iced Mocha', description: 'Coffee with chocolate and ice.', subcategory: 'Cold Coffee', category: 'Sips', price: '₹280', priceRaw: 280, rating: 4.6, tags: ['Cold', 'Chocolate', 'Iced'], isVeg: true },
  { id: 'cc-7', name: 'Iced Mint Mocha', description: 'Mocha with mint, served cold.', subcategory: 'Cold Coffee', category: 'Sips', price: '₹280', priceRaw: 280, rating: 4.6, tags: ['Cold', 'Mint', 'Chocolate'], isVeg: true },
];

// ─────────────────────────────────────────────────────────────────────────────
// BLENDED COFFEE (6)
// ─────────────────────────────────────────────────────────────────────────────
const BLENDED_COFFEE: RotticiousMenuItem[] = [
  { id: 'bc-1', name: 'Classic Cold Coffee', description: 'A thick and creamy coffee blend — smooth, bold, and always reliable.', subcategory: 'Blended Coffee', category: 'Sips', price: '₹260', priceRaw: 260, rating: 4.7, tags: ['Cold', 'Creamy', 'Classic'], isVeg: true, isPopular: true },
  { id: 'bc-2', name: 'Chocolate Cold Coffee', description: 'Decadent chocolate blended into rich, chilled coffee.', subcategory: 'Blended Coffee', category: 'Sips', price: '₹280', priceRaw: 280, rating: 4.7, tags: ['Cold', 'Chocolate', 'Indulgent'], isVeg: true },
  { id: 'bc-3', name: 'Biscoff Cold Coffee', description: 'A bold coffee shake with that signature Biscoff crunch and warmth.', subcategory: 'Blended Coffee', category: 'Sips', price: '₹300', priceRaw: 300, rating: 4.8, tags: ['Cold', 'Biscoff', 'Spiced'], isVeg: true, isPopular: true },
  { id: 'bc-4', name: 'Caramel Cold Coffee', description: 'Sweet and smooth with a caramel twist — chilled indulgence in a cup.', subcategory: 'Blended Coffee', category: 'Sips', price: '₹280', priceRaw: 280, rating: 4.7, tags: ['Cold', 'Caramel', 'Sweet'], isVeg: true },
  { id: 'bc-5', name: 'Nutella Cold Coffee', description: 'Thick, nutty, and chocolatey — a full-bodied cold coffee with a Nutella kick.', subcategory: 'Blended Coffee', category: 'Sips', price: '₹300', priceRaw: 300, rating: 4.8, tags: ['Cold', 'Nutella', 'Hazelnut'], isVeg: true },
  { id: 'bc-6', name: 'Peanut Butter Cold Coffee', description: 'A bold cold blend with creamy peanut butter flavour — rich and unforgettable.', subcategory: 'Blended Coffee', category: 'Sips', price: '₹300', priceRaw: 300, rating: 4.7, tags: ['Cold', 'Peanut Butter', 'Rich'], isVeg: true },
];

// ─────────────────────────────────────────────────────────────────────────────
// THICKSHAKE (8)
// ─────────────────────────────────────────────────────────────────────────────
const THICKSHAKES: RotticiousMenuItem[] = [
  { id: 'ts-1', name: 'Strawberry Thickshake', description: 'Lush and fruity, with full strawberry flavour in every sip.', subcategory: 'Thickshake', category: 'Sips', price: '₹280', priceRaw: 280, rating: 4.6, tags: ['Cold', 'Fruity', 'Thick'], isVeg: true },
  { id: 'ts-2', name: 'Mixed Berry Thickshake', description: 'Berry-loaded and smooth — fruity and indulgent.', subcategory: 'Thickshake', category: 'Sips', price: '₹300', priceRaw: 300, rating: 4.6, tags: ['Cold', 'Berry', 'Smooth'], isVeg: true },
  { id: 'ts-3', name: 'Caramel Thickshake', description: 'Sweet, buttery, and perfectly smooth.', subcategory: 'Thickshake', category: 'Sips', price: '₹280', priceRaw: 280, rating: 4.6, tags: ['Cold', 'Caramel', 'Buttery'], isVeg: true },
  { id: 'ts-4', name: 'Dryfruit Thickshake', description: 'Nutty, rich, and naturally sweet.', subcategory: 'Thickshake', category: 'Sips', price: '₹320', priceRaw: 320, rating: 4.7, tags: ['Cold', 'Nutty', 'Natural'], isVeg: true },
  { id: 'ts-5', name: 'Biscoff Thickshake', description: 'Creamy with bold Biscoff cookie flavour.', subcategory: 'Thickshake', category: 'Sips', price: '₹300', priceRaw: 300, rating: 4.8, tags: ['Cold', 'Biscoff', 'Cookie'], isVeg: true, isPopular: true },
  { id: 'ts-6', name: 'Peanutbutter Thickshake', description: 'Rich, creamy, and full of deep peanut butter flavour.', subcategory: 'Thickshake', category: 'Sips', price: '₹300', priceRaw: 300, rating: 4.7, tags: ['Cold', 'Peanut Butter', 'Rich'], isVeg: true },
  { id: 'ts-7', name: 'Nutella Thickshake', description: 'Smooth, chocolatey, and full of Nutella flavour.', subcategory: 'Thickshake', category: 'Sips', price: '₹300', priceRaw: 300, rating: 4.8, tags: ['Cold', 'Nutella', 'Chocolate'], isVeg: true, isPopular: true },
  { id: 'ts-8', name: 'Brownie Thickshake', description: 'Fudgy brownie blended into a rich, chocolate shake.', subcategory: 'Thickshake', category: 'Sips', price: '₹320', priceRaw: 320, rating: 4.8, tags: ['Cold', 'Brownie', 'Fudgy'], isVeg: true },
];

// ─────────────────────────────────────────────────────────────────────────────
// FIZZY DRINKS (4) + SLUSHY (4) → grouped
// ─────────────────────────────────────────────────────────────────────────────
const FIZZY_SLUSHY: RotticiousMenuItem[] = [
  { id: 'fz-1', name: 'Strawberry Fizzy', description: 'Fresh strawberry fizz — bright, bubbly, and refreshing.', subcategory: 'Fizzy & Slushy', category: 'Sips', price: '₹160', priceRaw: 160, rating: 4.5, tags: ['Cold', 'Fizzy', 'Fruity'], isVeg: true },
  { id: 'fz-2', name: 'Mixed Berry Fizzy', description: 'Bold berry flavours with a bubbly finish.', subcategory: 'Fizzy & Slushy', category: 'Sips', price: '₹160', priceRaw: 160, rating: 4.5, tags: ['Cold', 'Berry', 'Bubbly'], isVeg: true },
  { id: 'fz-3', name: 'Green Apple Fizzy', description: 'Green apple soda — crisp and cool with a zing.', subcategory: 'Fizzy & Slushy', category: 'Sips', price: '₹160', priceRaw: 160, rating: 4.5, tags: ['Cold', 'Apple', 'Tangy'], isVeg: true },
  { id: 'fz-4', name: 'Mint Fizzy', description: 'Minty-fresh, fizzy and super refreshing.', subcategory: 'Fizzy & Slushy', category: 'Sips', price: '₹160', priceRaw: 160, rating: 4.5, tags: ['Cold', 'Mint', 'Fresh'], isVeg: true },
  { id: 'sl-1', name: 'Strawberry Slushy', description: 'Frosty, fruity, and full of strawberry punch.', subcategory: 'Fizzy & Slushy', category: 'Sips', price: '₹180', priceRaw: 180, rating: 4.5, tags: ['Slushy', 'Fruity', 'Frozen'], isVeg: true },
  { id: 'sl-2', name: 'Mixed Berry Slushy', description: 'Icy slush loaded with mixed berry flavour.', subcategory: 'Fizzy & Slushy', category: 'Sips', price: '₹180', priceRaw: 180, rating: 4.5, tags: ['Slushy', 'Berry', 'Icy'], isVeg: true },
  { id: 'sl-3', name: 'Green Apple Slushy', description: 'A frozen green apple blast — sweet, tangy, and bold.', subcategory: 'Fizzy & Slushy', category: 'Sips', price: '₹180', priceRaw: 180, rating: 4.5, tags: ['Slushy', 'Apple', 'Tangy'], isVeg: true },
  { id: 'sl-4', name: 'Mint Slushy', description: 'Cool mint and crushed ice — fresh, light, and crisp.', subcategory: 'Fizzy & Slushy', category: 'Sips', price: '₹180', priceRaw: 180, rating: 4.5, tags: ['Slushy', 'Mint', 'Refreshing'], isVeg: true },
];

// ─────────────────────────────────────────────────────────────────────────────
// APPETIZERS (11)
// ─────────────────────────────────────────────────────────────────────────────
const APPETIZERS: RotticiousMenuItem[] = [
  { id: 'ap-1', name: 'Cheesy Garlic Bread', description: 'Hand made bread smeared with butter, baked with melted cheese.', subcategory: 'Appetizers', category: 'Bites', price: '₹180', priceRaw: 180, rating: 4.6, tags: ['Veg', 'Cheesy', 'Baked'], isVeg: true, image: '/bite_chicken_bread.png' },
  { id: 'ap-2', name: 'Chilli Cheese Garlic Bread', description: 'Hand made bread smeared with butter, baked with chilli, jalapeños, peppers and cheese.', subcategory: 'Appetizers', category: 'Bites', price: '₹200', priceRaw: 200, rating: 4.7, tags: ['Veg', 'Spicy', 'Cheesy'], isVeg: true },
  { id: 'ap-3', name: 'Chicken Nuggets', description: 'Crispy, golden chicken bites — 7 pieces per serving.', subcategory: 'Appetizers', category: 'Bites', price: '₹220', priceRaw: 220, rating: 4.6, tags: ['Chicken', 'Crispy', 'Golden'], isVeg: false },
  { id: 'ap-4', name: 'Veg Nuggets', description: 'Crunchy vegetable bites — 7 pieces per serving.', subcategory: 'Appetizers', category: 'Bites', price: '₹200', priceRaw: 200, rating: 4.5, tags: ['Veg', 'Crunchy', 'Bites'], isVeg: true },
  { id: 'ap-5', name: 'Salted Fries', description: 'Classic salted fries, crispier and tastier than the usual.', subcategory: 'Appetizers', category: 'Bites', price: '₹180', priceRaw: 180, rating: 4.5, tags: ['Veg', 'Crispy', 'Classic'], isVeg: true },
  { id: 'ap-6', name: 'Ooey Gooey Cheesy Fries', description: 'Fries smothered in melted cheese, jalapeños and pickles for ultimate indulgence.', subcategory: 'Appetizers', category: 'Bites', price: '₹240', priceRaw: 240, rating: 4.7, tags: ['Veg', 'Cheesy', 'Loaded'], isVeg: true, isPopular: true },
  { id: 'ap-7', name: 'Nashville Fried Chicken Fries', description: 'Crispy fried chicken pieces tossed with spicy Nashville seasoning, served with chipotle dipping sauce.', subcategory: 'Appetizers', category: 'Bites', price: '₹280', priceRaw: 280, rating: 4.8, tags: ['Chicken', 'Spicy', 'Nashville'], isVeg: false, isPopular: true },
  { id: 'ap-8', name: 'Madras Fried Chicken', description: 'Southern-style crispy fried chicken with a bold, spicy Madras twist — soulful and fiery.', subcategory: 'Appetizers', category: 'Bites', price: '₹320', priceRaw: 320, rating: 4.7, tags: ['Chicken', 'Spicy', 'Madras'], isVeg: false },
  { id: 'ap-9', name: 'BBQed Glazed Wings', description: 'Tender wings glazed in smoky barbecue sauce.', subcategory: 'Appetizers', category: 'Bites', price: '₹360', priceRaw: 360, rating: 4.7, tags: ['Chicken', 'BBQ', 'Wings'], isVeg: false },
  { id: 'ap-10', name: 'Peri-peri Dusted Wings', description: 'Spicy wings with fiery peri-peri seasoning.', subcategory: 'Appetizers', category: 'Bites', price: '₹360', priceRaw: 360, rating: 4.7, tags: ['Chicken', 'Peri-Peri', 'Spicy'], isVeg: false },
  { id: 'ap-11', name: 'Honey Garlic Wings', description: 'Wings coated in a sweet and savory honey garlic glaze.', subcategory: 'Appetizers', category: 'Bites', price: '₹360', priceRaw: 360, rating: 4.8, tags: ['Chicken', 'Honey', 'Garlic'], isVeg: false, isPopular: true },
];

// ─────────────────────────────────────────────────────────────────────────────
// SANDWICHES (2)
// ─────────────────────────────────────────────────────────────────────────────
const SANDWICHES: RotticiousMenuItem[] = [
  { id: 'sw-1', name: 'Double Decker Veg Sandwich', description: 'A hearty vegetarian sandwich stacked high with fresh ingredients.', subcategory: 'Sandwiches', category: 'Bites', price: '₹280', priceRaw: 280, rating: 4.5, tags: ['Veg', 'Double', 'Fresh'], isVeg: true },
  { id: 'sw-2', name: 'Double Decker Chicken Sandwich', description: 'Sliced juicy chicken thigh with stacked veggies in a double-layered delight.', subcategory: 'Sandwiches', category: 'Bites', price: '₹320', priceRaw: 320, rating: 4.7, tags: ['Chicken', 'Double', 'Juicy'], isVeg: false, isPopular: true },
];

// ─────────────────────────────────────────────────────────────────────────────
// CHICKEN STEAKS (3)
// ─────────────────────────────────────────────────────────────────────────────
const CHICKEN_STEAKS: RotticiousMenuItem[] = [
  { id: 'cs-1', name: 'Chicken Steak with Brown Sauce', description: 'Classic steak served with rich brown sauce.', subcategory: 'Chicken Steaks', category: 'Bites', price: '₹380', priceRaw: 380, rating: 4.6, tags: ['Chicken', 'Steak', 'Brown Sauce'], isVeg: false },
  { id: 'cs-2', name: 'Chicken Steak with Southern Spice', description: 'Tender chicken with bold southern spices.', subcategory: 'Chicken Steaks', category: 'Bites', price: '₹380', priceRaw: 380, rating: 4.7, tags: ['Chicken', 'Steak', 'Spicy'], isVeg: false, isPopular: true },
  { id: 'cs-3', name: 'Chicken Steak with Creamy Pesto', description: 'Juicy steak topped with luscious pesto cream.', subcategory: 'Chicken Steaks', category: 'Bites', price: '₹400', priceRaw: 400, rating: 4.7, tags: ['Chicken', 'Pesto', 'Creamy'], isVeg: false },
];

// ─────────────────────────────────────────────────────────────────────────────
// BURGERS (5)
// ─────────────────────────────────────────────────────────────────────────────
const BURGERS: RotticiousMenuItem[] = [
  { id: 'bg-1', name: 'Smashed Double Patty Chicken Burger', description: 'Juicy double chicken patties with cheese and signature sauce, caramelised onions.', subcategory: 'Burgers', category: 'Signatures', price: '₹420', priceRaw: 420, rating: 4.8, tags: ['Chicken', 'Double Patty', 'Signature'], isVeg: false, isPopular: true },
  { id: 'bg-2', name: 'Hot Smoky Nashville Burger', description: 'Spicy and smoky chicken burger with chipotle sauce — for heat lovers.', subcategory: 'Burgers', category: 'Signatures', price: '₹440', priceRaw: 440, rating: 4.8, tags: ['Chicken', 'Nashville', 'Spicy'], isVeg: false, isPopular: true },
  { id: 'bg-3', name: 'Cheesy Fried Chicken Burger', description: 'Crispy chicken loaded with cheese sauce and pickles.', subcategory: 'Burgers', category: 'Signatures', price: '₹400', priceRaw: 400, rating: 4.7, tags: ['Chicken', 'Cheesy', 'Crispy'], isVeg: false },
  { id: 'bg-4', name: 'Coated Paneer Burger', description: 'Crispy paneer with fresh veggies and sauces.', subcategory: 'Burgers', category: 'Signatures', price: '₹360', priceRaw: 360, rating: 4.6, tags: ['Veg', 'Paneer', 'Crispy'], isVeg: true },
  { id: 'bg-5', name: 'Asian Zing Burger', description: 'Crispy chicken glazed with kaffir lime chilli infused oil.', subcategory: 'Burgers', category: 'Signatures', price: '₹440', priceRaw: 440, rating: 4.8, tags: ['Chicken', 'Asian', 'Kaffir Lime'], isVeg: false },
];

// ─────────────────────────────────────────────────────────────────────────────
// PASTA (5)
// ─────────────────────────────────────────────────────────────────────────────
const PASTA: RotticiousMenuItem[] = [
  { id: 'pa-1', name: 'White Sauce Pasta', description: 'Rich, creamy and comforting with a cheesy finish — a go-to for anyone who loves comfort food.', subcategory: 'Pasta', category: 'Signatures', price: '₹300', priceRaw: 300, rating: 4.6, tags: ['Veg', 'Creamy', 'White Sauce'], isVeg: true },
  { id: 'pa-2', name: 'Red Sauce Pasta', description: 'Tangy, bold, and herby with a deep tomato punch — simple, satisfying, and full of flavour.', subcategory: 'Pasta', category: 'Signatures', price: '₹280', priceRaw: 280, rating: 4.6, tags: ['Veg', 'Tomato', 'Herby'], isVeg: true },
  { id: 'pa-3', name: 'Pink Sauce Pasta', description: 'The best of both worlds — creamy and tangy blended into one perfectly balanced pasta.', subcategory: 'Pasta', category: 'Signatures', price: '₹320', priceRaw: 320, rating: 4.7, tags: ['Veg', 'Pink Sauce', 'Balanced'], isVeg: true, isPopular: true },
  { id: 'pa-4', name: 'Pesto Pasta', description: 'Fresh, nutty, and aromatic with a burst of herbs — light but loaded with flavour.', subcategory: 'Pasta', category: 'Signatures', price: '₹340', priceRaw: 340, rating: 4.7, tags: ['Veg', 'Pesto', 'Herbaceous'], isVeg: true },
  { id: 'pa-5', name: 'Aglio Olio Pasta', description: 'Minimal, garlicky, and spiced just right — a light, flavour-forward classic.', subcategory: 'Pasta', category: 'Signatures', price: '₹280', priceRaw: 280, rating: 4.6, tags: ['Veg', 'Garlic', 'Classic'], isVeg: true },
];

// ─────────────────────────────────────────────────────────────────────────────
// HAND MADE NEOPOLITAN STYLE PIZZA (4)
// ─────────────────────────────────────────────────────────────────────────────
const PIZZA: RotticiousMenuItem[] = [
  { id: 'pz-1', name: 'Classic Margherita', description: 'Fresh mozzarella, tomato, and basil. Simple perfection.', subcategory: 'Pizza', category: 'Signatures', price: '₹380', priceRaw: 380, rating: 4.7, tags: ['Veg', 'Classic', 'Neopolitan'], isVeg: true },
  { id: 'pz-2', name: 'Exotic Veg Pizza', description: 'Loaded with seasonal vegetables on a hand-stretched Neopolitan base.', subcategory: 'Pizza', category: 'Signatures', price: '₹420', priceRaw: 420, rating: 4.6, tags: ['Veg', 'Loaded', 'Seasonal'], isVeg: true },
  { id: 'pz-3', name: 'Paneer Tikka Pizza', description: 'Marinated paneer with vibrant spices on a house-made Neopolitan crust.', subcategory: 'Pizza', category: 'Signatures', price: '₹480', priceRaw: 480, rating: 4.7, tags: ['Veg', 'Paneer Tikka', 'Spiced'], isVeg: true, isPopular: true },
  { id: 'pz-4', name: 'Grilled Chicken Pizza', description: 'Tender grilled chicken with onions and peppers on a crispy Neopolitan crust.', subcategory: 'Pizza', category: 'Signatures', price: '₹520', priceRaw: 520, rating: 4.8, tags: ['Chicken', 'Grilled', 'Neopolitan'], isVeg: false, isPopular: true },
];

// ─────────────────────────────────────────────────────────────────────────────
// DESSERTS (3)
// ─────────────────────────────────────────────────────────────────────────────
const DESSERTS: RotticiousMenuItem[] = [
  { id: 'ds-1', name: 'Caramel Fudge Brownie', description: 'Decadently rich chocolate brownie swirled with luscious, golden caramel for the perfect sweet-and-salty treat.', subcategory: 'Desserts', category: 'Sweets', price: '₹220', priceRaw: 220, rating: 4.8, tags: ['Veg', 'Brownie', 'Caramel'], isVeg: true, isPopular: true },
  { id: 'ds-2', name: 'Biscoff Fudge Brownie', description: 'Moist, fudgy chocolate brownie layered with creamy Biscoff spread, with a satisfyingly crunchy-spiced finish.', subcategory: 'Desserts', category: 'Sweets', price: '₹240', priceRaw: 240, rating: 4.9, tags: ['Veg', 'Biscoff', 'Fudgy'], isVeg: true, isPopular: true },
  { id: 'ds-3', name: 'Decadent Chocolate Brownie', description: 'Classic chocolate brownie taken to the next level — rich, fudgy, and irresistibly chocolatey in every bite.', subcategory: 'Desserts', category: 'Sweets', price: '₹200', priceRaw: 200, rating: 4.8, tags: ['Veg', 'Chocolate', 'Classic'], isVeg: true, image: '/sig_hot_chocolate.png' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Full combined menu
// ─────────────────────────────────────────────────────────────────────────────
export const ROTTICIOUS_MENU: RotticiousMenuItem[] = [
  ...HOT_COFFEE,
  ...COLD_COFFEE,
  ...BLENDED_COFFEE,
  ...THICKSHAKES,
  ...FIZZY_SLUSHY,
  ...APPETIZERS,
  ...SANDWICHES,
  ...CHICKEN_STEAKS,
  ...BURGERS,
  ...PASTA,
  ...PIZZA,
  ...DESSERTS,
];

// Ordered sub-category list for sidebar display
export const SUBCATEGORY_LIST: { id: MenuSubCategory; label: string; count: number }[] = [
  { id: 'Hot Coffee',     label: 'Hot Coffee',       count: HOT_COFFEE.length },
  { id: 'Cold Coffee',    label: 'Cold Coffee',       count: COLD_COFFEE.length },
  { id: 'Blended Coffee', label: 'Blended Coffee',    count: BLENDED_COFFEE.length },
  { id: 'Thickshake',     label: 'Thickshakes',       count: THICKSHAKES.length },
  { id: 'Fizzy & Slushy', label: 'Fizzy & Slushy',   count: FIZZY_SLUSHY.length },
  { id: 'Appetizers',     label: 'Appetizers',        count: APPETIZERS.length },
  { id: 'Sandwiches',     label: 'Sandwiches',        count: SANDWICHES.length },
  { id: 'Chicken Steaks', label: 'Chicken Steaks',   count: CHICKEN_STEAKS.length },
  { id: 'Burgers',        label: 'Burgers',           count: BURGERS.length },
  { id: 'Pasta',          label: 'Pasta',             count: PASTA.length },
  { id: 'Pizza',          label: 'Pizza',             count: PIZZA.length },
  { id: 'Desserts',       label: 'Desserts',          count: DESSERTS.length },
];

export const getMenuBySubcategory = (sub: MenuSubCategory) =>
  ROTTICIOUS_MENU.filter(i => i.subcategory === sub);

export const getMenuByCategory = (cat: MenuCategory) =>
  ROTTICIOUS_MENU.filter(i => i.category === cat);
