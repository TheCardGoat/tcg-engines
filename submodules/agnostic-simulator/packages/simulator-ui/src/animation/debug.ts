const DEBUG_STORAGE_KEY = "tcg:animationDebug";
const DEBUG_QUERY_PARAM = "animationDebug";

export function isSimulatorAnimationDebugEnabled(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    return (
      window.localStorage.getItem(DEBUG_STORAGE_KEY) === "1" ||
      new URLSearchParams(window.location.search).get(DEBUG_QUERY_PARAM) === "1"
    );
  } catch {
    return false;
  }
}

export function simulatorAnimationDebug(label: string, payload: unknown): void {
  if (!isSimulatorAnimationDebugEnabled()) {
    return;
  }
  console.debug(`[sim-animation] ${label}`, payload);
}
