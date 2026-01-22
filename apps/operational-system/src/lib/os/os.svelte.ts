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

class OperatingSystem {
  windows = $state<WindowState[]>([]);
  activeWindowId = $state<string | null>(null);
  desktopIcons = $state<AppDefinition[]>([]);
  isCommandCenterOpen = $state(false);

  private nextZIndex = 100;

  constructor() {
    // Initialize with some default desktop icons if needed
  }

  toggleCommandCenter() {
    this.isCommandCenterOpen = !this.isCommandCenterOpen;
  }

  registerApp(app: AppDefinition) {
    this.desktopIcons.push(app);
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
  }

  focusWindow(id: string) {
    const win = this.windows.find((w) => w.id === id);
    if (win) {
      win.zIndex = this.nextZIndex++;
      this.activeWindowId = id;
      if (win.isMinimized) {
        win.isMinimized = false;
      }
    }
  }

  minimizeWindow(id: string) {
    const win = this.windows.find((w) => w.id === id);
    if (win) {
      win.isMinimized = true;
      if (this.activeWindowId === id) {
        this.activeWindowId = null; // Or focus next
      }
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
    }
  }
}

export const os = new OperatingSystem();
