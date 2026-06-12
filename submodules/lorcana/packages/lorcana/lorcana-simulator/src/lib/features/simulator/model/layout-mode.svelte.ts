import { MediaQuery } from "svelte/reactivity";

export type SimulatorLayoutMode = "desktop" | "mobile";

const DESKTOP_MIN_WIDTH = 1240;

export class SimulatorLayoutModeObserver {
  #desktopQuery = new MediaQuery(`min-width: ${DESKTOP_MIN_WIDTH}px`);

  get current(): SimulatorLayoutMode {
    if (this.#desktopQuery.current) {
      return "desktop";
    }

    return "mobile";
  }

  get isCompact(): boolean {
    return this.current !== "desktop";
  }
}
