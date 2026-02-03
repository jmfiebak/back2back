import { Injectable } from '@angular/core';
import { Purchases, PRODUCT_CATEGORY, PurchasesStoreProduct } from '@revenuecat/purchases-capacitor';
import { StorageService } from './storage.service';
import { PremiumCache, ShopItem, ShopProduct, StoreProduct, getIncludedCategoryIds } from '../models';
import { SHOP_PRODUCTS } from '../data/shop-products.data';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private readonly CACHE_KEY = 'premium_purchases';
  private purchasedCategories: Set<string> = new Set();
  private initialized = false;

  constructor(private storage: StorageService) {}

  /**
   * Initialize RevenueCat and sync purchase state.
   * Call once at app startup (e.g. in AppComponent.ngOnInit).
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await Purchases.configure({ apiKey: environment.revenueCatApiKey });
      await this.syncWithStore();
    } catch (error) {
      console.warn('RevenueCat initialization failed, using cache', error);
      await this.loadFromCache();
    }

    this.initialized = true;
  }

  /**
   * Synchronous check whether a category has been purchased.
   * Uses the in-memory Set populated during initialize().
   */
  isCategoryPurchased(categoryId: string): boolean {
    return this.purchasedCategories.has(categoryId);
  }

  /**
   * Trigger a purchase flow for a given product.
   * Returns true if the purchase was successful, false if cancelled or failed.
   */
  async purchaseProduct(productId: string): Promise<boolean> {
    try {
      const { products } = await Purchases.getProducts({
        productIdentifiers: [productId],
        type: PRODUCT_CATEGORY.NON_SUBSCRIPTION
      });

      if (products.length === 0) {
        console.error('Product not found:', productId);
        return false;
      }

      await Purchases.purchaseStoreProduct({ product: products[0] });

      // After successful purchase, sync state
      await this.syncWithStore();
      return true;
    } catch (error: any) {
      if (error?.userCancelled) {
        console.log('Purchase cancelled by user');
      } else {
        console.error('Purchase failed:', error);
      }
      return false;
    }
  }

  /**
   * Restore previous purchases (e.g. after device change or reinstall).
   */
  async restorePurchases(): Promise<void> {
    try {
      await Purchases.restorePurchases();
      await this.syncWithStore();
    } catch (error) {
      console.error('Restore purchases failed:', error);
    }
  }

  /**
   * Build the list of shop items for the shop UI.
   * Combines local product definitions with store prices and purchase status.
   */
  async getShopItems(): Promise<ShopItem[]> {
    const productIds = SHOP_PRODUCTS.map(p => p.productId);
    let storeProducts: PurchasesStoreProduct[] = [];

    try {
      const result = await Purchases.getProducts({
        productIdentifiers: productIds,
        type: PRODUCT_CATEGORY.NON_SUBSCRIPTION
      });
      storeProducts = result.products;
    } catch (error) {
      console.warn('Could not fetch store products:', error);
    }

    const storeProductMap = new Map(
      storeProducts.map(sp => [sp.identifier, sp])
    );

    return SHOP_PRODUCTS
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(product => ({
        product,
        storeInfo: this.mapStoreProduct(storeProductMap.get(product.productId)),
        isPurchased: this.isProductPurchased(product)
      }));
  }

  /**
   * Check if all categories of a product have been purchased.
   */
  private isProductPurchased(product: ShopProduct): boolean {
    const categoryIds = getIncludedCategoryIds(product);
    return categoryIds.every(id => this.purchasedCategories.has(id));
  }

  /**
   * Map a RevenueCat store product to our StoreProduct interface.
   */
  private mapStoreProduct(product: PurchasesStoreProduct | undefined): StoreProduct | null {
    if (!product) return null;

    return {
      productId: product.identifier,
      localizedPrice: product.priceString,
      title: product.title,
      description: product.description
    };
  }

  /**
   * Fetch current entitlements from RevenueCat and update local state.
   */
  private async syncWithStore(): Promise<void> {
    const { customerInfo } = await Purchases.getCustomerInfo();

    const purchasedCategoryIds: string[] = [];

    for (const product of SHOP_PRODUCTS) {
      const entitlement = customerInfo.entitlements.active[product.productId];
      if (entitlement) {
        purchasedCategoryIds.push(...getIncludedCategoryIds(product));
      }
    }

    this.purchasedCategories = new Set(purchasedCategoryIds);
    await this.saveToCache(purchasedCategoryIds);
  }

  /**
   * Load purchased category IDs from device storage into memory.
   */
  private async loadFromCache(): Promise<void> {
    const cache = await this.storage.get<PremiumCache>(this.CACHE_KEY);
    this.purchasedCategories = new Set(cache?.purchasedCategoryIds ?? []);
  }

  /**
   * Persist purchased category IDs to device storage.
   */
  private async saveToCache(categoryIds: string[]): Promise<void> {
    await this.storage.set<PremiumCache>(this.CACHE_KEY, {
      purchasedCategoryIds: categoryIds,
      lastVerified: new Date().toISOString()
    });
  }
}
