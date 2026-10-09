const DEBUG_STORAGE_KEY = "tcg:audioDebug";
const DEBUG_QUERY_PARAM = "audioDebug";

export function isSimulatorAudioDebugEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return (
      window.localStorage.getItem(DEBUG_STORAGE_KEY) === "1" ||
      new URLSearchParams(window.location.search).get(DEBUG_QUERY_PARAM) === "1"
    );
  } catch {
    return false;
  }
}

export function simulatorAudioDebug(label: string, payload: unknown): void {
  if (!isSimulatorAudioDebugEnabled()) return;
  console.debug(`[sim-audio] ${label}`, payload);
}
