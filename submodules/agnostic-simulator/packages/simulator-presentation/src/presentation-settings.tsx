import {
  createContext,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

function subscribe(listener: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
}
const readReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const serverReducedMotion = () => false;
const defaults = {
  soundEnabled: true,
  reducedMotion: false,
  systemReducedMotion: false,
  setSoundEnabled: (_value: boolean) => {},
  setReducedMotion: (_value: boolean) => {},
};
const Settings = createContext(defaults);

/** Match-lifetime preferences shared by the board, DOM effects and audio. */
export function PresentationSettingsProvider({ children }: { children: ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [reduceMotion, setReducedMotion] = useState(false);
  const systemReducedMotion = useSyncExternalStore(
    subscribe,
    readReducedMotion,
    serverReducedMotion,
  );
  const value = useMemo(
    () => ({
      soundEnabled,
      reducedMotion: reduceMotion || systemReducedMotion,
      systemReducedMotion,
      setSoundEnabled,
      setReducedMotion,
    }),
    [soundEnabled, reduceMotion, systemReducedMotion],
  );
  return <Settings.Provider value={value}>{children}</Settings.Provider>;
}
export const usePresentationSettings = () => useContext(Settings);
