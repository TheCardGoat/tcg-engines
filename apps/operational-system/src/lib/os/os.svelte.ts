import type { Component } from "svelte";

export type AppDefinition = {
  id: string;
  title: string;
  icon: string;
  component: Component;
  defaultWidth?: number;
  defaultHeight?: number;
};

export type WindowState = {
  id: string;
  appId: string;
  title: string;
  icon: string;
  component: Component;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  prevBounds?: { x: number; y: number; width: number; height: number };
};

export type PersistedWindowStateV1 = {
  id: string;
  appId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  prevBounds?: { x: number; y: number; width: number; height: number };
};

export type PersistedOSStateV1 = {
  version: 1;
  windows: PersistedWindowStateV1[];
  activeWindowId: string | null;
  isCommandCenterOpen: boolean;
};

class OperatingSystem {
  windows = $state<WindowState[]>([]);
  activeWindowId = $state<string | null>(null);
  desktopIcons = $state<AppDefinition[]>([]);
  isCommandCenterOpen = $state(false);

  private nextZIndex = 100;
  private persistScheduled = false;
  private storageKey = "tcg.operational-system.osState";

  constructor() {
    // Initialize with some default desktop icons if needed
  }

  toggleCommandCenter() {
    this.isCommandCenterOpen = !this.isCommandCenterOpen;
    this.schedulePersist();
  }

  registerApp(app: AppDefinition) {
    this.desktopIcons.push(app);
  }

  hydrateFromStorage() {
    if (!this.canUseStorage()) return;

    const raw = window.localStorage.getItem(this.storageKey);
    if (!raw) return;

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return;
    }

    if (!this.isPersistedOSStateV1(parsed)) return;

    const hydratedWindows: WindowState[] = [];

    for (const w of parsed.windows) {
      const app = this.desktopIcons.find((a) => a.id === w.appId);
      if (!app) continue;
      hydratedWindows.push({
        id: w.id,
        appId: w.appId,
        title: app.title,
        icon: app.icon,
        component: app.component,
        x: w.x,
        y: w.y,
        width: w.width,
        height: w.height,
        isMinimized: w.isMinimized,
        isMaximized: w.isMaximized,
        zIndex: w.zIndex,
        prevBounds: w.prevBounds,
      });
    }

    this.windows = hydratedWindows;
    this.isCommandCenterOpen = parsed.isCommandCenterOpen;
    this.activeWindowId = hydratedWindows.some(
      (w) => w.id === parsed.activeWindowId,
    )
      ? parsed.activeWindowId
      : null;

    const maxZ = hydratedWindows.reduce(
      (max, w) => (w.zIndex > max ? w.zIndex : max),
      99,
    );
    this.nextZIndex = maxZ + 1;
  }

  openWindow(appId: string) {
    const app = this.desktopIcons.find((a) => a.id === appId);
    if (!app) return;

    const id = crypto.randomUUID();
    const width = app.defaultWidth || 800;
    const height = app.defaultHeight || 600;

    // Simple cascade positioning
    const offset = this.windows.length * 30;
    const x = 100 + offset;
    const y = 50 + offset;

    const newWindow: WindowState = {
      id,
      appId: app.id,
      title: app.title,
      icon: app.icon,
      component: app.component,
      x,
      y,
      width,
      height,
      isMinimized: false,
      isMaximized: false,
      zIndex: this.nextZIndex++,
    };

    this.windows.push(newWindow);
    this.focusWindow(id);
    this.schedulePersist();
  }

  closeWindow(id: string) {
    this.windows = this.windows.filter((w) => w.id !== id);
    if (this.activeWindowId === id) {
      // Focus the next top-most window
      const remaining = this.windows.filter((w) => !w.isMinimized);
      if (remaining.length > 0) {
        const top = remaining.reduce((prev, current) =>
          prev.zIndex > current.zIndex ? prev : current,
        );
        this.activeWindowId = top.id;
      } else {
        this.activeWindowId = null;
      }
    }

    this.schedulePersist();
  }

  focusWindow(id: string) {
    const win = this.windows.find((w) => w.id === id);
    if (win) {
      win.zIndex = this.nextZIndex++;
      this.activeWindowId = id;
      if (win.isMinimized) {
        win.isMinimized = false;
      }
      this.schedulePersist();
    }
  }

  minimizeWindow(id: string) {
    const win = this.windows.find((w) => w.id === id);
    if (win) {
      win.isMinimized = true;
      if (this.activeWindowId === id) {
        this.activeWindowId = null; // Or focus next
      }
      this.schedulePersist();
    }
  }

  maximizeWindow(id: string) {
    const win = this.windows.find((w) => w.id === id);
    if (win) {
      if (win.isMaximized) {
        // Restore
        if (win.prevBounds) {
          win.x = win.prevBounds.x;
          win.y = win.prevBounds.y;
          win.width = win.prevBounds.width;
          win.height = win.prevBounds.height;
        }
        win.isMaximized = false;
      } else {
        // Maximize
        win.prevBounds = {
          x: win.x,
          y: win.y,
          width: win.width,
          height: win.height,
        };
        win.x = 0;
        win.y = 0;
        // We'll need to know the desktop bounds, but for now let's assume full available space
        // This might need adjustment based on taskbar height
        win.width = window.innerWidth;
        win.height = window.innerHeight - 48; // Assume 48px taskbar
        win.isMaximized = true;
      }
      this.focusWindow(id);
      this.schedulePersist();
    }
  }

  updateWindowBounds(
    id: string,
    bounds: Partial<{ x: number; y: number; width: number; height: number }>,
  ) {
    const win = this.windows.find((w) => w.id === id);
    if (win) {
      if (bounds.x !== undefined) win.x = bounds.x;
      if (bounds.y !== undefined) win.y = bounds.y;
      if (bounds.width !== undefined) win.width = bounds.width;
      if (bounds.height !== undefined) win.height = bounds.height;
      this.schedulePersist();
    }
  }

  private canUseStorage() {
    return (
      typeof window !== "undefined" &&
      typeof window.localStorage !== "undefined"
    );
  }

  private schedulePersist() {
    if (!this.canUseStorage()) return;
    if (this.persistScheduled) return;
    this.persistScheduled = true;

    queueMicrotask(() => {
      this.persistScheduled = false;
      this.persistNow();
    });
  }

  private persistNow() {
    if (!this.canUseStorage()) return;

    const persisted: PersistedOSStateV1 = {
      version: 1,
      windows: this.windows.map((w) => ({
        id: w.id,
        appId: w.appId,
        x: w.x,
        y: w.y,
        width: w.width,
        height: w.height,
        isMinimized: w.isMinimized,
        isMaximized: w.isMaximized,
        zIndex: w.zIndex,
        prevBounds: w.prevBounds,
      })),
      activeWindowId: this.activeWindowId,
      isCommandCenterOpen: this.isCommandCenterOpen,
    };

    try {
      window.localStorage.setItem(this.storageKey, JSON.stringify(persisted));
    } catch {
      return;
    }
  }

  private isPersistedOSStateV1(value: unknown): value is PersistedOSStateV1 {
    if (!value || typeof value !== "object") return false;
    const v = value as Record<string, unknown>;
    if (v.version !== 1) return false;
    if (!Array.isArray(v.windows)) return false;
    if (!(typeof v.activeWindowId === "string" || v.activeWindowId === null)) {
      return false;
    }
    if (typeof v.isCommandCenterOpen !== "boolean") return false;
    return true;
  }
}

export const os = new OperatingSystem();
