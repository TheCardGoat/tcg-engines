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

export type PersistedOSStateV2 = {
  version: 2;
  windows: PersistedWindowStateV1[];
  activeWindowId: string | null;
  isCommandCenterOpen: boolean;
  apps: Record<string, unknown>;
};

export type WindowSnapTarget = "left" | "right";

class OperatingSystem {
  windows = $state<WindowState[]>([]);
  activeWindowId = $state<string | null>(null);
  desktopIcons = $state<AppDefinition[]>([]);
  isCommandCenterOpen = $state(false);
  isRightPanelOpen = $state(false);
  appsState = $state<Record<string, unknown>>({});

  draggingWindowId = $state<string | null>(null);
  dragSnapTarget = $state<WindowSnapTarget | null>(null);

  private nextZIndex = 100;
  private persistTimer: number | null = null;
  private persistLastAt = 0;
  private storageKey = "tcg.operational-system.osState";

  constructor() {
    // Initialize with some default desktop icons if needed
  }

  toggleCommandCenter() {
    this.isCommandCenterOpen = !this.isCommandCenterOpen;
    this.schedulePersist();
  }

  toggleRightPanel() {
    this.isRightPanelOpen = !this.isRightPanelOpen;
  }

  startWindowDrag(windowId: string) {
    this.draggingWindowId = windowId;
    this.dragSnapTarget = null;
  }

  setDragSnapTarget(target: WindowSnapTarget | null) {
    this.dragSnapTarget = target;
  }

  endWindowDrag() {
    this.draggingWindowId = null;
    this.dragSnapTarget = null;
  }

  closeRightPanel() {
    this.isRightPanelOpen = false;
  }

  closeAllWindows() {
    this.windows = [];
    this.activeWindowId = null;
    this.schedulePersist();
  }

  registerApp(app: AppDefinition) {
    this.desktopIcons.push(app);
  }

  hydrateFromStorage() {
    if (!this.canUseStorage()) return;

    const raw = window.localStorage.getItem(this.storageKey);
    if (!raw) return;

    const parsed = this.parsePersistedState(raw);
    if (!parsed) return;

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
    this.appsState = parsed.apps;
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

    const existing = this.windows.filter((w) => w.appId === appId);
    if (existing.length > 0) {
      const top = existing.reduce((prev, current) =>
        prev.zIndex > current.zIndex ? prev : current,
      );
      this.focusWindow(top.id);
      return;
    }

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
        const chromeHeight = 48;
        win.x = 0;
        win.y = chromeHeight;
        // We'll need to know the desktop bounds, but for now let's assume full available space
        // This might need adjustment based on top chrome height
        win.width = window.innerWidth;
        win.height = window.innerHeight - chromeHeight;
        win.isMaximized = true;
      }
      this.focusWindow(id);
      this.schedulePersist();
    }
  }

  snapWindowToHalf(id: string, side: WindowSnapTarget) {
    const win = this.windows.find((w) => w.id === id);
    if (!win) return;

    const chromeHeight = 48;
    const fullWidth = window.innerWidth;
    const fullHeight = window.innerHeight - chromeHeight;

    win.isMaximized = false;
    win.x = side === "left" ? 0 : Math.floor(fullWidth / 2);
    win.y = chromeHeight;
    win.width = Math.floor(fullWidth / 2);
    win.height = fullHeight;

    this.focusWindow(id);
    this.schedulePersist();
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

  getAppState<T>(appId: string): T | undefined {
    return this.appsState[appId] as T | undefined;
  }

  setAppState(appId: string, next: unknown) {
    this.appsState[appId] = next;
    this.schedulePersist();
  }

  private canUseStorage() {
    return (
      typeof window !== "undefined" &&
      typeof window.localStorage !== "undefined"
    );
  }

  private schedulePersist() {
    if (!this.canUseStorage()) return;
    if (this.persistTimer !== null) return;

    const minIntervalMs = 250;
    const now = Date.now();
    const dueIn = Math.max(0, minIntervalMs - (now - this.persistLastAt));

    this.persistTimer = window.setTimeout(() => {
      this.persistTimer = null;
      this.persistLastAt = Date.now();
      this.persistNow();
    }, dueIn);
  }

  private persistNow() {
    if (!this.canUseStorage()) return;

    const persisted: PersistedOSStateV2 = {
      version: 2,
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
      apps: this.appsState,
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

  private isPersistedOSStateV2(value: unknown): value is PersistedOSStateV2 {
    if (!value || typeof value !== "object") return false;
    const v = value as Record<string, unknown>;
    if (v.version !== 2) return false;
    if (!Array.isArray(v.windows)) return false;
    if (!(typeof v.activeWindowId === "string" || v.activeWindowId === null)) {
      return false;
    }
    if (typeof v.isCommandCenterOpen !== "boolean") return false;
    if (!v.apps || typeof v.apps !== "object" || Array.isArray(v.apps))
      return false;
    return true;
  }

  private parsePersistedState(raw: string): PersistedOSStateV2 | null {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return null;
    }

    if (this.isPersistedOSStateV2(parsed)) return parsed;
    if (this.isPersistedOSStateV1(parsed)) {
      return {
        version: 2,
        windows: parsed.windows,
        activeWindowId: parsed.activeWindowId,
        isCommandCenterOpen: parsed.isCommandCenterOpen,
        apps: {},
      };
    }

    return null;
  }
}

export const os = new OperatingSystem();
