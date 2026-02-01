import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    /**
     * Speichert Daten im LocalStorage
     */
    set<T>(key: string, value: T): void {
        try {
            const serialized = JSON.stringify(value);
            localStorage.setItem(key, serialized);
        } catch (error) {
            console.error('Error saving to localStorage', error);
        }
    }

    /**
     * Lädt Daten aus LocalStorage
     */
    get<T>(key: string): T | null {
        try {
            const item = localStorage.getItem(key);
            if (!item) {
                return null;
            }
            return JSON.parse(item) as T;
        } catch (error) {
            console.error('Error loading from localStorage', error);
            return null;
        }
    }

    /**
     * Löscht Daten aus LocalStorage
     */
    remove(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage', error);
        }
    }

    /**
     * Löscht alle Daten aus LocalStorage
     */
    clear(): void {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage', error);
        }
    }

    /**
     * Prüft ob Key existiert
     */
    has(key: string): boolean {
        return localStorage.getItem(key) !== null;
    }
}