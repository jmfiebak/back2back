import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private get isNative(): boolean {
    return Capacitor.isNativePlatform();
  }

  /**
   * Saves data to device storage (native) or localStorage (web)
   */
  async set<T>(key: string, value: T): Promise<void> {
    try {
      const serialized = JSON.stringify(value);

      if (this.isNative) {
        await Preferences.set({ key, value: serialized });
      } else {
        localStorage.setItem(key, serialized);
      }
    } catch (error) {
      console.error('Error saving to storage', error);
    }
  }

  /**
   * Loads data from device storage (native) or localStorage (web)
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      if (this.isNative) {
        const { value } = await Preferences.get({ key });
        return value ? JSON.parse(value) as T : null;
      } else {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) as T : null;
      }
    } catch (error) {
      console.error('Error loading from storage', error);
      return null;
    }
  }

  /**
   * Removes data from storage
   */
  async remove(key: string): Promise<void> {
    try {
      if (this.isNative) {
        await Preferences.remove({ key });
      } else {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Error removing from storage', error);
    }
  }

  /**
   * Clears all data from storage
   */
  async clear(): Promise<void> {
    try {
      if (this.isNative) {
        await Preferences.clear();
      } else {
        localStorage.clear();
      }
    } catch (error) {
      console.error('Error clearing storage', error);
    }
  }

  /**
   * Checks if key exists in storage
   */
  async has(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== null;
  }
}
