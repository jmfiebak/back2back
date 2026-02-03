import { ShopProduct } from '../models';

/**
 * Premium category IDs that can be purchased individually.
 * Update this list when adding new premium categories.
 */
const PREMIUM_CATEGORY_IDS = ['secrets', 'rumors'];

/**
 * Static product definitions for the in-app shop.
 *
 * Product IDs must match the IDs configured in RevenueCat / App Store / Google Play.
 * Prices are fetched from the store at runtime and are NOT defined here.
 */
export const SHOP_PRODUCTS: ShopProduct[] = [
  // Bundle: All premium categories
  {
    productId: 'bundle_all_premium',
    type: 'bundle',
    includedCategoryIds: PREMIUM_CATEGORY_IDS,
    features: [
      'Alle Premium-Kategorien',
      'Zukünftige Kategorien inklusive'
    ],
    icon: 'assets/icons/bundle.svg',
    sortOrder: 0
  },

  // Single categories
  {
    productId: 'category_secrets',
    type: 'single_category',
    categoryId: 'secrets',
    icon: 'assets/icons/secrets.svg',
    sortOrder: 1
  },
  {
    productId: 'category_rumors',
    type: 'single_category',
    categoryId: 'rumors',
    icon: 'assets/icons/rumors.svg',
    sortOrder: 2
  }
];
