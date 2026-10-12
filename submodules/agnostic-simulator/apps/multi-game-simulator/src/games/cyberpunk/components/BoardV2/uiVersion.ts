import { useSyncExternalStore } from "react";
import { useSearchParams } from "react-router";

export type CyberpunkUiVersion = "v1" | "v2";
export const CYBERPUNK_UI_VERSION_STORAGE_KEY = "tcg:cyberpunk:ui-version:v1";
const preferenceChangedEvent = "tcg:cyberpunk:ui-version-changed";

export function readCyberpunkUiPreference(): CyberpunkUiVersion {
  try {
    return typeof window !== "undefined" &&
      window.localStorage.getItem(CYBERPUNK_UI_VERSION_STORAGE_KEY) === "v2"
      ? "v2"
      : "v1";
  } catch {
    return "v1";
  }
}

export function saveCyberpunkUiPreference(version: CyberpunkUiVersion): void {
  try {
    window.localStorage.setItem(CYBERPUNK_UI_VERSION_STORAGE_KEY, version);
    window.dispatchEvent(new Event(preferenceChangedEvent));
  } catch {
    // Storage can be blocked. The URL still permits switching this game.
  }
}

export function resolveCyberpunkUiVersion(
  params: URLSearchParams,
  preference: CyberpunkUiVersion,
): CyberpunkUiVersion {
  const explicit = params.get("ui");
  return explicit === "v1" || explicit === "v2" ? explicit : preference;
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(preferenceChangedEvent, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(preferenceChangedEvent, onChange);
  };
}

function serverPreference(): CyberpunkUiVersion {
  return "v1";
}

export function useCyberpunkUiV2(): boolean {
  const [params] = useSearchParams();
  const preference = useSyncExternalStore(subscribe, readCyberpunkUiPreference, serverPreference);
  return resolveCyberpunkUiVersion(params, preference) === "v2";
}
