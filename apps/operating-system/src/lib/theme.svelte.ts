export type ThemeName = "light" | "dark";

function isThemeName(value: unknown): value is ThemeName {
  return value === "light" || value === "dark";
}

class ThemeManager {
  current = $state<ThemeName>("light");
  private storageKey = "tcg.operational-system.theme";

  hydrate() {
    if (typeof window === "undefined") return;

    const fromDom = document.documentElement.dataset.theme;
    if (isThemeName(fromDom)) {
      this.current = fromDom;
      return;
    }

    const fromStorage = window.localStorage.getItem(this.storageKey);
    if (isThemeName(fromStorage)) {
      this.set(fromStorage);
    }
  }

  set(next: ThemeName) {
    this.current = next;
    this.applyToDocument(next);
    this.persist(next);
  }

  toggle() {
    this.set(this.current === "dark" ? "light" : "dark");
  }

  private applyToDocument(next: ThemeName) {
    if (typeof document === "undefined") return;
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
  }

  private persist(next: ThemeName) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(this.storageKey, next);
    } catch {
      return;
    }
  }
}

export const theme = new ThemeManager();
