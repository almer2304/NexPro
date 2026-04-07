import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PropertyFilters, Notification } from "@/types";

// ── Favorites Store ───────────────────────────────────────────
interface FavoritesState {
  favoriteIds: string[];
  hydrated: boolean;
  setFavorites: (ids: string[]) => void;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  setHydrated: (v: boolean) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      hydrated: false,
      setFavorites: (ids) => set({ favoriteIds: ids }),
      addFavorite: (id) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.includes(id) ? state.favoriteIds : [...state.favoriteIds, id],
        })),
      removeFavorite: (id) =>
        set((state) => ({ favoriteIds: state.favoriteIds.filter((fid) => fid !== id) })),
      isFavorite: (id) => get().favoriteIds.includes(id),
      setHydrated: (v) => set({ hydrated: v }),
    }),
    {
      name: "nexpro-favorites",
      onRehydrateStorage: () => (state) => { state?.setHydrated(true); },
    }
  )
);

// ── Search Filters Store ──────────────────────────────────────
interface SearchState {
  filters: PropertyFilters;
  setFilters: (filters: Partial<PropertyFilters>) => void;
  resetFilters: () => void;
  activeFilterCount: () => number;
}

export const useSearchStore = create<SearchState>()((set, get) => ({
  filters: {},
  setFilters: (newFilters) => set((state) => ({ filters: { ...state.filters, ...newFilters } })),
  resetFilters: () => set({ filters: {} }),
  activeFilterCount: () =>
    Object.values(get().filters).filter((v) => v !== undefined && v !== "").length,
}));

// ── UI State Store ────────────────────────────────────────────
interface UIState {
  isFilterSidebarOpen: boolean;
  toggleFilterSidebar: () => void;
  searchViewMode: "grid" | "map";
  setSearchViewMode: (mode: "grid" | "map") => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (v: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isFilterSidebarOpen: false,
      toggleFilterSidebar: () => set((state) => ({ isFilterSidebarOpen: !state.isFilterSidebarOpen })),
      searchViewMode: "grid",
      setSearchViewMode: (mode) => set({ searchViewMode: mode }),
      isDarkMode: false,
      toggleDarkMode: () =>
        set((state) => {
          const next = !state.isDarkMode;
          if (typeof document !== "undefined") document.documentElement.classList.toggle("dark", next);
          return { isDarkMode: next };
        }),
      setDarkMode: (v) => {
        if (typeof document !== "undefined") document.documentElement.classList.toggle("dark", v);
        set({ isDarkMode: v });
      },
    }),
    { name: "nexpro-ui" }
  )
);

// ── Compare Store ─────────────────────────────────────────────
interface CompareState {
  compareIds: string[];
  addToCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
  canAddMore: () => boolean;
}

export const useCompareStore = create<CompareState>()((set, get) => ({
  compareIds: [],
  addToCompare: (id) =>
    set((state) =>
      state.compareIds.length < 3 && !state.compareIds.includes(id)
        ? { compareIds: [...state.compareIds, id] }
        : state
    ),
  removeFromCompare: (id) =>
    set((state) => ({ compareIds: state.compareIds.filter((c) => c !== id) })),
  clearCompare: () => set({ compareIds: [] }),
  isInCompare: (id) => get().compareIds.includes(id),
  canAddMore: () => get().compareIds.length < 3,
}));

// ── Notifications Store ───────────────────────────────────────
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (n: Notification[]) => void;
  addNotification: (n: Notification) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) =>
    set({ notifications, unreadCount: notifications.filter((n) => !n.is_read).length }),
  addNotification: (n) =>
    set((state) => ({
      notifications: [n, ...state.notifications],
      unreadCount: state.unreadCount + (n.is_read ? 0 : 1),
    })),
  markRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => n.id === id ? { ...n, is_read: true } : n),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
      unreadCount: 0,
    })),
}));
