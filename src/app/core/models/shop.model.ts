export type ProductType = 'single_category' | 'bundle';

/**
 * Base interface for all purchasable products
 */
export interface PremiumProduct {
  productId: string;
  type: ProductType;
  icon: string;
  sortOrder: number;
}

/**
 * A single premium category that can be purchased individually
 */
export interface SingleCategoryProduct extends PremiumProduct {
  type: 'single_category';
  categoryId: string;
}

/**
 * A bundle of multiple premium categories
 */
export interface BundleProduct extends PremiumProduct {
  type: 'bundle';
  includedCategoryIds: string[];
  features: string[];
}

/**
 * Discriminated union of all purchasable product types
 */
export type ShopProduct = SingleCategoryProduct | BundleProduct;

/**
 * Product information fetched from the store at runtime
 */
export interface StoreProduct {
  productId: string;
  localizedPrice: string;
  title: string;
  description: string;
}

/**
 * Combined view model for the shop UI
 */
export interface ShopItem {
  product: ShopProduct;
  storeInfo: StoreProduct | null;
  isPurchased: boolean;
}

/**
 * Cache structure for persisting purchased category IDs
 */
export interface PremiumCache {
  purchasedCategoryIds: string[];
  lastVerified: string;
}

/**
 * Returns the category IDs included in a product
 */
export function getIncludedCategoryIds(product: ShopProduct): string[] {
  if (product.type === 'single_category') {
    return [product.categoryId];
  }
  return product.includedCategoryIds;
}
