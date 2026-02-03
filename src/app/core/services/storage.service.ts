import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  /**
   * Saves data to storage
   */
  async set<T>(key: string, value: T): Promise<void> {
    try {
      await Preferences.set({ key, value: JSON.stringify(value) });
    } catch (error) {
      console.error('Error saving to storage', error);
    }
  }

  /**
   * Loads data from storage
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const { value } = await Preferences.get({ key });
      return value ? JSON.parse(value) as T : null;
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
      await Preferences.remove({ key });
    } catch (error) {
      console.error('Error removing from storage', error);
    }
  }

  /**
   * Clears all data from storage
   */
  async clear(): Promise<void> {
    try {
      await Preferences.clear();
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
