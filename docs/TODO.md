# Weiterentwicklung

## Übersicht

Dieses Dokument beschreibt den Plan zur Implementierung von Premium-Kategorien und In-App-Käufen für Back2Back.

---

## 1. Capacitor Integration

### Installation

```bash
npm install @capacitor/core @capacitor/cli
npx cap init "Back2Back" "com.yourcompany.back2back"

npm install @capacitor/preferences
npm install @capacitor/android @capacitor/ios

npx cap sync
```

### Speicher-Migration

Der bestehende `StorageService` wird auf Capacitor Preferences migriert:

- **Native Plattformen:** SharedPreferences (Android) / UserDefaults (iOS)
- **Web:** localStorage als Fallback
- **Änderung:** Alle Methoden werden `async`

```typescript
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({ providedIn: 'root' })
export class StorageService {

  async set<T>(key: string, value: T): Promise<void> {
    const serialized = JSON.stringify(value);

    if (Capacitor.isNativePlatform()) {
      await Preferences.set({ key, value: serialized });
    } else {
      localStorage.setItem(key, serialized);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (Capacitor.isNativePlatform()) {
      const { value } = await Preferences.get({ key });
      return value ? JSON.parse(value) as T : null;
    } else {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) as T : null;
    }
  }

  // remove(), clear(), has() analog anpassen...
}
```

---

## 2. Premium-Verifizierung (Serverless)

### Architektur-Entscheidung

**Serverless Ansatz:** Lokaler Cache + Store-APIs

| Vorteil | Erklärung |
|---------|-----------|
| Keine Server-Kosten | Kein Backend nötig |
| Einfachere Architektur | Weniger bewegliche Teile |
| Store übernimmt Validierung | Google/Apple verifizieren Käufe |
| Offline-fähig | Cache erlaubt Nutzung ohne Internet |

| Akzeptiertes Risiko | Erklärung |
|---------------------|-----------|
| Manipulation möglich | Rooted/Jailbroken Geräte können Cache editieren |
| Kein Cross-Device-Sync | Nur über Store-Account-Wiederherstellung |

### PurchaseService

Einmalige Verifizierung beim App-Start, danach synchroner Zugriff:

```typescript
interface PremiumCache {
  purchasedCategoryIds: string[];
  lastVerified: string;
}

@Injectable({ providedIn: 'root' })
export class PurchaseService {
  private readonly CACHE_KEY = 'premium_purchases';
  private purchasedCategories: Set<string> = new Set();
  private initialized = false;

  constructor(private storage: StorageService) {}

  /**
   * Einmalig beim App-Start aufrufen
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    if (Capacitor.isNativePlatform()) {
      await this.verifyWithStore();
    } else {
      await this.loadFromCache();
    }

    this.initialized = true;
  }

  /**
   * Schnelle synchrone Prüfung - nutzt In-Memory Set
   */
  isCategoryPurchased(categoryId: string): boolean {
    return this.purchasedCategories.has(categoryId);
  }

  private async verifyWithStore(): Promise<void> {
    try {
      // Store-API Integration (z.B. RevenueCat)
      // const customerInfo = await Purchases.getCustomerInfo();
      // const purchasedIds = Object.keys(customerInfo.entitlements.active);

      const purchasedIds: string[] = []; // TODO: Implementieren

      this.purchasedCategories = new Set(purchasedIds);
      await this.saveToCache(purchasedIds);
    } catch (error) {
      console.warn('Store offline, using cache');
      await this.loadFromCache();
    }
  }

  private async loadFromCache(): Promise<void> {
    const cache = await this.storage.get<PremiumCache>(this.CACHE_KEY);
    this.purchasedCategories = new Set(cache?.purchasedCategoryIds ?? []);
  }

  private async saveToCache(categoryIds: string[]): Promise<void> {
    await this.storage.set<PremiumCache>(this.CACHE_KEY, {
      purchasedCategoryIds: categoryIds,
      lastVerified: new Date().toISOString()
    });
  }
}
```

---

## 3. Shop-Datenmodell

### Was kommt vom Store vs. lokal?

| Information | Quelle | Anmerkung |
|-------------|--------|-----------|
| Preis | Store-API | Lokalisiert (z.B. "2,99 €") |
| Produktname | Store-API | Im Store-Backend definiert |
| Produkt-ID | Beide | Muss übereinstimmen |
| Kaufstatus | Store-API | Ob bereits gekauft |
| Mapping: Produkt → Kategorien | Lokal | Store weiß das nicht |
| Icons / Bilder | Lokal | Für In-App-UI |
| Reihenfolge | Lokal | Shop-Sortierung |
| Feature-Liste | Lokal | Beschreibungen für UI |

### Preismodell

- **Einzelkategorie:** 1 € pro Kategorie
- **Bundle:** 5 € für alle Premium-Kategorien

### TypeScript Interfaces

```typescript
type ProductType = 'single_category' | 'bundle';

interface PremiumProduct {
  productId: string;        // Muss mit Store-Produkt-ID übereinstimmen
  type: ProductType;
  icon: string;             // Asset-Pfad für Shop-UI
  sortOrder: number;
}

interface SingleCategoryProduct extends PremiumProduct {
  type: 'single_category';
  categoryId: string;
}

interface BundleProduct extends PremiumProduct {
  type: 'bundle';
  includedCategoryIds: string[];
  features: string[];       // Bullet-Points für Shop-Seite
}

type ShopProduct = SingleCategoryProduct | BundleProduct;

// Vom Store zur Laufzeit
interface StoreProduct {
  productId: string;
  localizedPrice: string;   // "2,99 €"
  title: string;
  description: string;
}

// Kombiniert für Shop-Anzeige
interface ShopItem {
  product: ShopProduct;     // Lokale Daten
  storeInfo: StoreProduct;  // Vom Store
  isPurchased: boolean;
}
```

### Beispiel-Konfiguration

```typescript
const shopProducts: ShopProduct[] = [
  // Bundle oben anzeigen
  {
    productId: 'bundle_all_premium',
    type: 'bundle',
    includedCategoryIds: ['secrets', 'rumors', 'spicy', /* ... */],
    features: [
      'Alle Premium-Kategorien',
      'Zukünftige Kategorien inklusive'
    ],
    icon: 'assets/icons/bundle.svg',
    sortOrder: 0
  },
  // Einzelkategorien
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
```

### Hilfsfunktion

```typescript
function getCategoryIds(product: ShopProduct): string[] {
  if (product.type === 'single_category') {
    return [product.categoryId];
  }
  return product.includedCategoryIds;
}
```

---

## 4. Ablauf Shop-Seite

```
1. Lokale Paket-Definitionen laden (shopProducts)
2. Store-API: Produkte mit Preisen abrufen
3. Store-API: Kaufstatus prüfen
4. Kombinieren → ShopItems für UI rendern
```

---

## 5. Empfohlene Store-Integration

Für die Store-API empfehlen wir eines dieser Plugins:

- **RevenueCat:** `@revenuecat/purchases-capacitor`
  - Vorteile: Cross-Platform, gutes Dashboard, kostenlos bis $2.5k MTR

- **Capawesome:** `@capawesome/capacitor-purchases`
  - Vorteile: Native Integration, keine Drittanbieter-Abhängigkeit

---

## 6. Offene Punkte

- [ ] Store-Accounts erstellen (Google Play Console / App Store Connect)
- [ ] Produkt-IDs im Store anlegen
- [ ] Store-Plugin auswählen und integrieren
- [ ] Shop-UI designen
- [ ] Premium-Kategorien definieren
- [ ] Icons für Shop erstellen

---

## 7. UI Component Library (Material Design Ablösung)

### Ziel

Vollständige Kontrolle über das Styling bei minimaler Programmierarbeit.

### Strategie

| Komponente | Lösung | Begründung |
|------------|--------|------------|
| Buttons | Native HTML + Tailwind | Semantisch simpel |
| Inputs | Native HTML + Tailwind | Keine komplexe Logik nötig |
| Textarea | CDK `cdkTextareaAutosize` | Auto-Grow Funktionalität |
| Chips | Eigene Component | Styled `<span>` mit State |
| ButtonToggleGroup | Eigene Component | Native Buttons + State |
| Dropdowns | CDK Overlay | Positionierung, Backdrop, Keyboard |
| Modals / Dialogs | CDK Dialog | Focus Trap, Escape, Backdrop |
| Tooltips | CDK Overlay | Positionierung, Verzögerung |
| Tabs | CDK Tabs | Keyboard Navigation, ARIA |
| Accordion | CDK Accordion | Keyboard Navigation, ARIA |
| Drag & Drop | CDK DragDrop | Komplexe Interaktionslogik |

### Angular CDK Module

Das CDK (`@angular/cdk`) ist bereits installiert und bietet Verhaltens-Primitives ohne Styling:

| Modul | Einsatzbereich |
|-------|----------------|
| `@angular/cdk/overlay` | Popups, Modals, Dropdowns, Tooltips |
| `@angular/cdk/dialog` | Modal Dialogs mit Focus Management |
| `@angular/cdk/a11y` | Focus Traps, Live Announcer, Keyboard Navigation |
| `@angular/cdk/accordion` | Expandable Panels |
| `@angular/cdk/stepper` | Multi-Step Forms |
| `@angular/cdk/drag-drop` | Drag & Drop Interaktionen |
| `@angular/cdk/listbox` | Selectable Lists mit Keyboard Support |
| `@angular/cdk/menu` | Accessible Menus |

### Workflow

1. **Einfache Elemente** → Natives HTML + Tailwind
2. **Komplexe Interaktionen** → CDK für Logik, komplett selbst stylen
3. **Wiederverwendbar machen** → Eigene Component-Library aufbauen

---

## 8. Dateien die geändert werden müssen

| Datei | Änderung |
|-------|----------|
| `package.json` | Capacitor Dependencies |
| `storage.service.ts` | Async + Capacitor Preferences |
| Neu: `purchase.service.ts` | Premium-Verwaltung |
| Neu: `shop.data.ts` | Produkt-Definitionen |
| Neu: `premium.models.ts` | TypeScript Interfaces |
| `game.service.ts` | Async Storage-Aufrufe |
| `app.component.ts` | PurchaseService.initialize() |
