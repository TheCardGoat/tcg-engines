/**
 * Svelte 5 port of the `useIdle` React hook from @uidotdev/usehooks.
 * https://github.com/uidotdev/usehooks/blob/945436df0037bc21133379a5e13f1bd73f1ffc36/index.js#L464
 *
 * Tracks whether the local player has been idle (no input for `ms` milliseconds)
 * and whether their browser tab is currently visible.
 *
 * Instantiate once per game session, call attach() in onMount and detach() in onDestroy.
 */

const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "resize",
  "keydown",
  "touchstart",
  "wheel",
] as const;

function throttle<T extends (...args: never[]) => void>(fn: T, limitMs: number): T {
  let lastCall = 0;
  return ((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= limitMs) {
      lastCall = now;
      fn(...args);
    }
  }) as T;
}

export class IdleStore {
  idle = $state(false);
  tabVisible = $state(true);
  isAfk = $derived(this.idle || !this.tabVisible);

  readonly #ms: number;
  #timeoutId: ReturnType<typeof setTimeout> | null = null;
  #handleEvent: (() => void) | null = null;
  #handleVisibilityChange: (() => void) | null = null;

  constructor(ms = 30_000) {
    this.#ms = ms;
  }

  attach(): void {
    if (typeof document === "undefined") return;

    this.tabVisible = !document.hidden;

    const resetTimeout = () => {
      if (this.#timeoutId !== null) clearTimeout(this.#timeoutId);
      this.#timeoutId = setTimeout(() => {
        this.idle = true;
      }, this.#ms);
    };

    this.#handleEvent = throttle(() => {
      this.idle = false;
      resetTimeout();
    }, 500);

    this.#handleVisibilityChange = () => {
      this.tabVisible = !document.hidden;
      if (!document.hidden) {
        this.#handleEvent!();
      }
    };

    // Start the initial timeout
    resetTimeout();

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, this.#handleEvent);
    }
    document.addEventListener("visibilitychange", this.#handleVisibilityChange);
  }

  detach(): void {
    if (typeof document === "undefined") return;
    if (this.#timeoutId !== null) {
      clearTimeout(this.#timeoutId);
      this.#timeoutId = null;
    }
    if (this.#handleEvent) {
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, this.#handleEvent);
      }
    }
    if (this.#handleVisibilityChange) {
      document.removeEventListener("visibilitychange", this.#handleVisibilityChange);
    }
    this.#handleEvent = null;
    this.#handleVisibilityChange = null;
  }

  /**
   * Subscribe to `isAfk` changes.
   * Uses `$effect.root` so it works from plain TS call sites (not just Svelte components).
   * The callback fires once immediately, then on every change.
   * Returns a cleanup function.
   */
  watch(callback: (idle: boolean, tabVisible: boolean) => void): () => void {
    return $effect.root(() => {
      $effect(() => {
        callback(this.idle, this.tabVisible);
      });
      return () => {};
    });
  }
}
