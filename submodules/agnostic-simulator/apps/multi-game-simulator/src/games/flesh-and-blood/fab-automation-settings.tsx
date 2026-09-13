import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  DEFAULT_FAB_AUTO_SELECT_SINGLETON_TARGETS as CONTRACT_DEFAULT_FAB_AUTO_SELECT_SINGLETON_TARGETS,
  DEFAULT_FAB_COUNTDOWN_SPEED as CONTRACT_DEFAULT_FAB_COUNTDOWN_SPEED,
  DEFAULT_FAB_PRIORITY_MODE as CONTRACT_DEFAULT_FAB_PRIORITY_MODE,
  FAB_AUTO_SELECT_SINGLETON_TARGETS_STORAGE_KEY as CONTRACT_FAB_AUTO_SELECT_SINGLETON_TARGETS_STORAGE_KEY,
  FAB_COUNTDOWN_SPEED_STORAGE_KEY as CONTRACT_FAB_COUNTDOWN_SPEED_STORAGE_KEY,
  FAB_PRIORITY_MODE_STORAGE_KEY as CONTRACT_FAB_PRIORITY_MODE_STORAGE_KEY,
  type FabCountdownSpeed,
} from "@tcg/game-page-contract";

import { apiUrl } from "../../runtime/gameRuntimeApi.ts";
import { useSimulatorAuth, useSimulatorUserSettings } from "../../simulator/providers/index.ts";
import type { FabPriorityAutomationMode } from "./state";

export const FAB_PRIORITY_MODE_STORAGE_KEY = CONTRACT_FAB_PRIORITY_MODE_STORAGE_KEY;
export const FAB_COUNTDOWN_SPEED_STORAGE_KEY = CONTRACT_FAB_COUNTDOWN_SPEED_STORAGE_KEY;
export const FAB_AUTO_SELECT_SINGLETON_TARGETS_STORAGE_KEY =
  CONTRACT_FAB_AUTO_SELECT_SINGLETON_TARGETS_STORAGE_KEY;
/**
 * Legacy key this provider wrote before the canonical contract key existed;
 * read once as a migration fallback, never written.
 */
export const LEGACY_FAB_PRIORITY_MODE_STORAGE_KEY =
  "matchmaking.flesh-and-blood.priorityAutomation";
export const FAB_TRIGGER_DECLINES_STORAGE_KEY =
  "matchmaking.flesh-and-blood.optionalTriggerDeclines";
export const FAB_TRIGGER_ACCEPTS_STORAGE_KEY = "matchmaking.flesh-and-blood.optionalTriggerAccepts";
export const DEFAULT_FAB_PRIORITY_MODE: FabPriorityAutomationMode =
  CONTRACT_DEFAULT_FAB_PRIORITY_MODE;
export const DEFAULT_FAB_COUNTDOWN_SPEED: FabCountdownSpeed = CONTRACT_DEFAULT_FAB_COUNTDOWN_SPEED;
export const DEFAULT_FAB_AUTO_SELECT_SINGLETON_TARGETS =
  CONTRACT_DEFAULT_FAB_AUTO_SELECT_SINGLETON_TARGETS;
/** Mirrors the contract's zod `.max(256)` on the stored decline list. */
export const MAX_FAB_TRIGGER_DECLINES = 256;

function validFabCountdownSpeed(value: unknown): FabCountdownSpeed | null {
  return value === "fast" || value === "normal" || value === "slow" ? value : null;
}

function storedBoolean(raw: string | null): boolean | null {
  if (raw === null) return null;
  if (raw === "true") return true;
  if (raw === "false") return false;
  return null;
}

interface FabServerSimulatorSettings {
  readonly priorityMode?: unknown;
  readonly countdownSpeed?: unknown;
  readonly autoOrderTriggers?: unknown;
  readonly autoSelectSingletonTargets?: unknown;
  readonly playAndSkipHoldCardIds?: unknown;
  readonly opponentTriggerYieldCardIds?: unknown;
  readonly optionalTriggerDeclines?: unknown;
  readonly optionalTriggerAccepts?: unknown;
}

interface FabSettingsResponse {
  readonly gameSettings?: {
    readonly "flesh-and-blood"?: {
      readonly simulator?: FabServerSimulatorSettings;
    };
  };
}

/**
 * Account-level FAB automation defaults: the priority mode, the countdown
 * speed, the trigger-order auto-answer toggle, the per-card own-skip
 * exception and opponent-yield lists, plus the canonical ids of cards whose
 * optional triggers are auto-declined. Stored settings keep the lists as
 * string arrays; the engine seed maps declines onto owned instances at match
 * creation.
 */
export interface FabAutomationSeed {
  readonly priorityMode: FabPriorityAutomationMode;
  readonly countdownSpeed: FabCountdownSpeed;
  readonly autoOrderTriggers: boolean;
  readonly autoSelectSingletonTargets: boolean;
  readonly playAndSkipHoldCardIds: readonly string[];
  readonly opponentTriggerYieldCardIds: readonly string[];
  readonly optionalTriggerDeclines: readonly string[];
  readonly optionalTriggerAccepts: readonly string[];
}

export interface FabAutomationSettingsContextValue {
  readonly priorityMode: FabPriorityAutomationMode;
  readonly countdownSpeed: FabCountdownSpeed;
  readonly autoOrderTriggers: boolean;
  readonly autoSelectSingletonTargets: boolean;
  readonly playAndSkipHoldCardIds: ReadonlySet<string>;
  readonly opponentTriggerYieldCardIds: ReadonlySet<string>;
  readonly declinedCanonicalIds: ReadonlySet<string>;
  readonly acceptedCanonicalIds: ReadonlySet<string>;
  readonly ready: boolean;
  readonly setPriorityMode: (mode: FabPriorityAutomationMode) => void;
  readonly setCountdownSpeed: (speed: FabCountdownSpeed) => void;
  readonly setAutoOrderTriggers: (enabled: boolean) => void;
  readonly setAutoSelectSingletonTargets: (enabled: boolean) => void;
  readonly setCardOptionalMode: (
    canonicalId: string,
    mode: "ask" | "auto-accept" | "auto-decline",
  ) => void;
  /** Toggle one canonical id in the per-card own-skip exception list. */
  readonly setPlayAndSkipHoldCard: (canonicalId: string, enabled: boolean) => void;
  /** Toggle one canonical id in the per-card opponent-trigger yield list. */
  readonly setOpponentTriggerYieldCard: (canonicalId: string, enabled: boolean) => void;
  /** Latest seed (pre-debounce) for practice/local match creation. */
  readonly readSeed: () => FabAutomationSeed;
}

const DEFAULT_SEED: FabAutomationSeed = {
  priorityMode: DEFAULT_FAB_PRIORITY_MODE,
  countdownSpeed: DEFAULT_FAB_COUNTDOWN_SPEED,
  autoOrderTriggers: false,
  autoSelectSingletonTargets: DEFAULT_FAB_AUTO_SELECT_SINGLETON_TARGETS,
  playAndSkipHoldCardIds: [],
  opponentTriggerYieldCardIds: [],
  optionalTriggerDeclines: [],
  optionalTriggerAccepts: [],
};

export const FabAutomationSettingsContext = createContext<FabAutomationSettingsContextValue>({
  priorityMode: DEFAULT_FAB_PRIORITY_MODE,
  countdownSpeed: DEFAULT_FAB_COUNTDOWN_SPEED,
  autoOrderTriggers: false,
  autoSelectSingletonTargets: DEFAULT_FAB_AUTO_SELECT_SINGLETON_TARGETS,
  playAndSkipHoldCardIds: new Set<string>(),
  opponentTriggerYieldCardIds: new Set<string>(),
  declinedCanonicalIds: new Set<string>(),
  acceptedCanonicalIds: new Set<string>(),
  ready: false,
  setPriorityMode: () => undefined,
  setCountdownSpeed: () => undefined,
  setAutoOrderTriggers: () => undefined,
  setAutoSelectSingletonTargets: () => undefined,
  setCardOptionalMode: () => undefined,
  setPlayAndSkipHoldCard: () => undefined,
  setOpponentTriggerYieldCard: () => undefined,
  readSeed: () => DEFAULT_SEED,
});

const SAVE_DEBOUNCE_MS = 500;

/** Dedupe, drop non-strings, and keep the newest ids within the contract cap. */
export function normalizeFabTriggerDeclines(values: readonly unknown[]): readonly string[] {
  const seen = new Set<string>();
  for (const value of values) {
    if (typeof value === "string" && value.length > 0 && !seen.has(value)) seen.add(value);
  }
  return [...seen].slice(-MAX_FAB_TRIGGER_DECLINES);
}

function validFabPriorityMode(value: unknown): FabPriorityAutomationMode | null {
  return value === "auto-pass" || value === "always-hold" || value === "play-and-skip"
    ? value
    : null;
}

export interface StoredFabAutomationSettings {
  readonly priorityMode: FabPriorityAutomationMode | null;
  readonly countdownSpeed: FabCountdownSpeed | null;
  readonly autoOrderTriggers: boolean | null;
  readonly autoSelectSingletonTargets: boolean | null;
  readonly playAndSkipHoldCardIds: readonly string[] | null;
  readonly opponentTriggerYieldCardIds: readonly string[] | null;
  readonly optionalTriggerDeclines: readonly string[] | null;
  readonly optionalTriggerAccepts: readonly string[] | null;
}

function storedCardList(storage: Storage, key: string): readonly string[] | null {
  const raw = storage.getItem(key);
  if (raw === null) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? normalizeFabTriggerDeclines(parsed) : null;
  } catch {
    return null;
  }
}

export function readStoredFabAutomationSettings(storage: Storage): StoredFabAutomationSettings {
  try {
    // Canonical key first; fall back to the legacy key this provider wrote
    // before the contract standardized it. The canonical key is (re)written
    // on the next save; the legacy value is only ever read.
    const priorityMode =
      validFabPriorityMode(storage.getItem(FAB_PRIORITY_MODE_STORAGE_KEY)) ??
      validFabPriorityMode(storage.getItem(LEGACY_FAB_PRIORITY_MODE_STORAGE_KEY));
    const rawDeclines = storage.getItem(FAB_TRIGGER_DECLINES_STORAGE_KEY);
    let optionalTriggerDeclines: readonly string[] | null = null;
    if (rawDeclines !== null) {
      try {
        const parsed: unknown = JSON.parse(rawDeclines);
        optionalTriggerDeclines = Array.isArray(parsed)
          ? normalizeFabTriggerDeclines(parsed)
          : null;
      } catch {
        optionalTriggerDeclines = null;
      }
    }
    return {
      priorityMode,
      countdownSpeed: validFabCountdownSpeed(storage.getItem(FAB_COUNTDOWN_SPEED_STORAGE_KEY)),
      autoOrderTriggers:
        storage.getItem("matchmaking.flesh-and-blood.autoOrderTriggers") === "true",
      autoSelectSingletonTargets: storedBoolean(
        storage.getItem(FAB_AUTO_SELECT_SINGLETON_TARGETS_STORAGE_KEY),
      ),
      playAndSkipHoldCardIds: storedCardList(
        storage,
        "matchmaking.flesh-and-blood.playAndSkipHoldCardIds",
      ),
      opponentTriggerYieldCardIds: storedCardList(
        storage,
        "matchmaking.flesh-and-blood.opponentTriggerYieldCardIds",
      ),
      optionalTriggerDeclines,
      optionalTriggerAccepts: storedCardList(storage, FAB_TRIGGER_ACCEPTS_STORAGE_KEY),
    };
  } catch {
    // Browser storage is best-effort; the defaults remain usable in privacy modes.
    return {
      priorityMode: null,
      countdownSpeed: null,
      autoOrderTriggers: null,
      autoSelectSingletonTargets: null,
      playAndSkipHoldCardIds: null,
      opponentTriggerYieldCardIds: null,
      optionalTriggerDeclines: null,
      optionalTriggerAccepts: null,
    };
  }
}

function writeStoredFabAutomationSettings(storage: Storage, seed: FabAutomationSeed): void {
  try {
    storage.setItem(FAB_PRIORITY_MODE_STORAGE_KEY, seed.priorityMode);
    storage.setItem(FAB_COUNTDOWN_SPEED_STORAGE_KEY, seed.countdownSpeed);
    storage.setItem(
      "matchmaking.flesh-and-blood.autoOrderTriggers",
      seed.autoOrderTriggers ? "true" : "false",
    );
    storage.setItem(
      FAB_AUTO_SELECT_SINGLETON_TARGETS_STORAGE_KEY,
      seed.autoSelectSingletonTargets ? "true" : "false",
    );
    storage.setItem(
      "matchmaking.flesh-and-blood.playAndSkipHoldCardIds",
      JSON.stringify(seed.playAndSkipHoldCardIds),
    );
    storage.setItem(
      "matchmaking.flesh-and-blood.opponentTriggerYieldCardIds",
      JSON.stringify(seed.opponentTriggerYieldCardIds),
    );
    storage.setItem(FAB_TRIGGER_DECLINES_STORAGE_KEY, JSON.stringify(seed.optionalTriggerDeclines));
    storage.setItem(FAB_TRIGGER_ACCEPTS_STORAGE_KEY, JSON.stringify(seed.optionalTriggerAccepts));
  } catch {
    // Browser storage is best-effort; the in-memory setting still applies.
  }
}

function serverCardList(value: unknown): readonly string[] {
  return Array.isArray(value) ? normalizeFabTriggerDeclines(value) : [];
}

/**
 * Account column wins when present (the resolved server response always
 * stamps the declared priority-mode default); otherwise browser storage;
 * otherwise the declared defaults.
 */
export function resolveFabAutomationSettings(
  serverSimulator: FabServerSimulatorSettings | undefined,
  stored: StoredFabAutomationSettings,
): FabAutomationSeed {
  if (serverSimulator !== undefined) {
    return {
      priorityMode: validFabPriorityMode(serverSimulator.priorityMode) ?? DEFAULT_FAB_PRIORITY_MODE,
      countdownSpeed:
        validFabCountdownSpeed(serverSimulator.countdownSpeed) ?? DEFAULT_FAB_COUNTDOWN_SPEED,
      autoOrderTriggers: serverSimulator.autoOrderTriggers === true,
      autoSelectSingletonTargets:
        typeof serverSimulator.autoSelectSingletonTargets === "boolean"
          ? serverSimulator.autoSelectSingletonTargets
          : DEFAULT_FAB_AUTO_SELECT_SINGLETON_TARGETS,
      playAndSkipHoldCardIds: serverCardList(serverSimulator.playAndSkipHoldCardIds),
      opponentTriggerYieldCardIds: serverCardList(serverSimulator.opponentTriggerYieldCardIds),
      optionalTriggerDeclines: serverCardList(serverSimulator.optionalTriggerDeclines),
      optionalTriggerAccepts: serverCardList(serverSimulator.optionalTriggerAccepts),
    };
  }
  return {
    priorityMode: stored.priorityMode ?? DEFAULT_FAB_PRIORITY_MODE,
    countdownSpeed: stored.countdownSpeed ?? DEFAULT_FAB_COUNTDOWN_SPEED,
    autoOrderTriggers: stored.autoOrderTriggers ?? false,
    autoSelectSingletonTargets:
      stored.autoSelectSingletonTargets ?? DEFAULT_FAB_AUTO_SELECT_SINGLETON_TARGETS,
    playAndSkipHoldCardIds: stored.playAndSkipHoldCardIds ?? [],
    opponentTriggerYieldCardIds: stored.opponentTriggerYieldCardIds ?? [],
    optionalTriggerDeclines: stored.optionalTriggerDeclines ?? [],
    optionalTriggerAccepts: stored.optionalTriggerAccepts ?? [],
  };
}

function readBrowserStoredFabAutomationSettings(): StoredFabAutomationSettings {
  if (typeof window === "undefined") {
    return {
      priorityMode: null,
      countdownSpeed: null,
      autoOrderTriggers: null,
      autoSelectSingletonTargets: null,
      playAndSkipHoldCardIds: null,
      opponentTriggerYieldCardIds: null,
      optionalTriggerDeclines: null,
      optionalTriggerAccepts: null,
    };
  }
  return readStoredFabAutomationSettings(window.localStorage);
}

/**
 * Live matches submit automated passes and declines to the server.
 * Authenticated players must not act on the default/localStorage value before
 * their account setting has loaded — otherwise a saved "hold" can lose a race
 * with the first priority window. Anonymous and local simulator play still
 * become ready immediately from browser storage.
 */
function isReadyWithoutServerValue(isAuthenticated: boolean): boolean {
  return !isAuthenticated && typeof window !== "undefined";
}

export function FabAutomationSettingsProvider({ children }: { readonly children: ReactNode }) {
  const auth = useSimulatorAuth();
  const { viewerSettings } = useSimulatorUserSettings();
  const serverSimulator = viewerSettings?.gameSettings["flesh-and-blood"]?.simulator;
  const [state, setState] = useState(() => {
    const seed = resolveFabAutomationSettings(
      serverSimulator,
      readBrowserStoredFabAutomationSettings(),
    );
    return {
      seed,
      ready: serverSimulator !== undefined || isReadyWithoutServerValue(auth.isAuthenticated),
    };
  });
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hydratedUserRef = useRef<string | null>(serverSimulator === undefined ? null : auth.userId);
  const editVersionRef = useRef(0);
  const seedRef = useRef(state.seed);

  const persistLocal = useCallback((seed: FabAutomationSeed) => {
    if (typeof window !== "undefined") {
      writeStoredFabAutomationSettings(window.localStorage, seed);
    }
  }, []);

  const clearPendingSave = useCallback(() => {
    if (saveTimerRef.current === null) return;
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = null;
  }, []);

  const applyResolvedSettings = useCallback(
    (simulator: FabServerSimulatorSettings | undefined, userId: string | null) => {
      hydratedUserRef.current = userId;
      const seed = resolveFabAutomationSettings(
        simulator,
        readBrowserStoredFabAutomationSettings(),
      );
      seedRef.current = seed;
      setState({ seed, ready: true });
      if (simulator !== undefined) {
        persistLocal(seed);
      }
    },
    [persistLocal],
  );

  // Canonical account settings from the shared user-settings context win
  // immediately when present.
  useEffect(() => {
    if (serverSimulator === undefined) return;
    applyResolvedSettings(serverSimulator, auth.userId);
  }, [applyResolvedSettings, auth.userId, serverSimulator]);

  // Anonymous / local: use browser storage as soon as we are in a browser.
  useEffect(() => {
    if (auth.isAuthenticated || serverSimulator !== undefined) return;
    if (typeof window === "undefined") return;
    setState((current) => {
      if (current.ready) return current;
      const seed = resolveFabAutomationSettings(
        undefined,
        readBrowserStoredFabAutomationSettings(),
      );
      seedRef.current = seed;
      return { seed, ready: true };
    });
  }, [auth.isAuthenticated, serverSimulator]);

  // Authenticated without a context value: fetch the account preference before
  // marking ready so automation cannot fire on the default while hydration is
  // in flight. Failures still become ready from browser storage so play is not
  // stuck forever.
  useEffect(() => {
    if (!auth.isAuthenticated || !auth.userId || serverSimulator !== undefined) return;
    if (hydratedUserRef.current === auth.userId) return;

    setState((current) => (current.ready ? { ...current, ready: false } : current));

    const hydrationEditVersion = editVersionRef.current;
    const controller = new AbortController();
    const userId = auth.userId;

    void fetch(apiUrl("platform", "/users/me/settings"), {
      credentials: "include",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) return undefined;
        const body = (await response.json()) as FabSettingsResponse;
        return body.gameSettings?.["flesh-and-blood"]?.simulator;
      })
      .then((remoteSimulator) => {
        if (controller.signal.aborted) return;
        if (editVersionRef.current !== hydrationEditVersion) return;
        applyResolvedSettings(remoteSimulator, userId);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        if (editVersionRef.current !== hydrationEditVersion) return;
        console.error("[fab-automation-settings] Failed to hydrate setting:", error);
        applyResolvedSettings(undefined, userId);
      });

    return () => controller.abort();
  }, [applyResolvedSettings, auth.isAuthenticated, auth.userId, serverSimulator]);

  const flushSave = useCallback(() => {
    if (!auth.isAuthenticated) return;
    const seed = seedRef.current;
    void fetch(apiUrl("platform", "/users/me/settings"), {
      method: "PUT",
      headers: { "content-type": "application/json" },
      credentials: "include",
      // Flushes can fire during teardown (unmount, pagehide); keepalive lets
      // the browser finish the PUT after the document goes away. The payload
      // is far under the 64 KiB keepalive budget.
      keepalive: true,
      body: JSON.stringify({
        gameSettings: {
          "flesh-and-blood": {
            // Full simulator patch: settings arrays replace whole, so the
            // debounced PUT is idempotent and lands the latest profile.
            simulator: {
              priorityMode: seed.priorityMode,
              countdownSpeed: seed.countdownSpeed,
              autoOrderTriggers: seed.autoOrderTriggers,
              autoSelectSingletonTargets: seed.autoSelectSingletonTargets,
              playAndSkipHoldCardIds: [...seed.playAndSkipHoldCardIds],
              opponentTriggerYieldCardIds: [...seed.opponentTriggerYieldCardIds],
              optionalTriggerDeclines: [...seed.optionalTriggerDeclines],
              optionalTriggerAccepts: [...seed.optionalTriggerAccepts],
            },
          },
        },
      }),
    })
      .then((response: Response) => {
        // fetch only rejects on network failure; an HTTP error status must be
        // surfaced too, or a rejected save looks exactly like a persisted one.
        if (!response.ok) {
          console.error(`[fab-automation-settings] Settings save rejected (${response.status}).`);
        }
      })
      .catch((error: unknown) => {
        console.error("[fab-automation-settings] Failed to save setting:", error);
      });
  }, [auth.isAuthenticated]);

  const saveNow = useCallback(() => {
    saveTimerRef.current = null;
    flushSave();
  }, [flushSave]);

  const scheduleSave = useCallback(() => {
    clearPendingSave();
    if (!auth.isAuthenticated) return;
    saveTimerRef.current = setTimeout(saveNow, SAVE_DEBOUNCE_MS);
  }, [auth.isAuthenticated, clearPendingSave, saveNow]);

  const setPriorityMode = useCallback(
    (mode: FabPriorityAutomationMode) => {
      editVersionRef.current += 1;
      const seed = { ...seedRef.current, priorityMode: mode };
      seedRef.current = seed;
      setState((current) => ({ ...current, seed }));
      persistLocal(seed);
      scheduleSave();
    },
    [persistLocal, scheduleSave],
  );

  const setCardOptionalMode = useCallback(
    (canonicalId: string, mode: "ask" | "auto-accept" | "auto-decline") => {
      if (!canonicalId) return;
      editVersionRef.current += 1;
      const optionalTriggerDeclines = seedRef.current.optionalTriggerDeclines.filter(
        (id) => id !== canonicalId,
      );
      const optionalTriggerAccepts = seedRef.current.optionalTriggerAccepts.filter(
        (id) => id !== canonicalId,
      );
      const seed = {
        ...seedRef.current,
        optionalTriggerDeclines:
          mode === "auto-decline"
            ? normalizeFabTriggerDeclines([...optionalTriggerDeclines, canonicalId])
            : optionalTriggerDeclines,
        optionalTriggerAccepts:
          mode === "auto-accept"
            ? normalizeFabTriggerDeclines([...optionalTriggerAccepts, canonicalId])
            : optionalTriggerAccepts,
      };
      seedRef.current = seed;
      setState((current) => ({ ...current, seed }));
      persistLocal(seed);
      scheduleSave();
    },
    [persistLocal, scheduleSave],
  );

  const setCountdownSpeed = useCallback(
    (speed: FabCountdownSpeed) => {
      editVersionRef.current += 1;
      const seed = { ...seedRef.current, countdownSpeed: speed };
      seedRef.current = seed;
      setState((current) => ({ ...current, seed }));
      persistLocal(seed);
      scheduleSave();
    },
    [persistLocal, scheduleSave],
  );

  const setAutoOrderTriggers = useCallback(
    (enabled: boolean) => {
      editVersionRef.current += 1;
      const seed = { ...seedRef.current, autoOrderTriggers: enabled };
      seedRef.current = seed;
      setState((current) => ({ ...current, seed }));
      persistLocal(seed);
      scheduleSave();
    },
    [persistLocal, scheduleSave],
  );

  const setAutoSelectSingletonTargets = useCallback(
    (enabled: boolean) => {
      editVersionRef.current += 1;
      const seed = { ...seedRef.current, autoSelectSingletonTargets: enabled };
      seedRef.current = seed;
      setState((current) => ({ ...current, seed }));
      persistLocal(seed);
      scheduleSave();
    },
    [persistLocal, scheduleSave],
  );

  const setCardListEntry = useCallback(
    (
      key: "playAndSkipHoldCardIds" | "opponentTriggerYieldCardIds",
      canonicalId: string,
      enabled: boolean,
    ) => {
      if (!canonicalId) return;
      editVersionRef.current += 1;
      const currentIds = seedRef.current[key];
      const ids = enabled
        ? normalizeFabTriggerDeclines([...currentIds, canonicalId])
        : currentIds.filter((id) => id !== canonicalId);
      const seed = { ...seedRef.current, [key]: ids };
      seedRef.current = seed;
      setState((current) => ({ ...current, seed }));
      persistLocal(seed);
      scheduleSave();
    },
    [persistLocal, scheduleSave],
  );

  const setPlayAndSkipHoldCard = useCallback(
    (canonicalId: string, enabled: boolean) =>
      setCardListEntry("playAndSkipHoldCardIds", canonicalId, enabled),
    [setCardListEntry],
  );

  const setOpponentTriggerYieldCard = useCallback(
    (canonicalId: string, enabled: boolean) =>
      setCardListEntry("opponentTriggerYieldCardIds", canonicalId, enabled),
    [setCardListEntry],
  );

  const readSeed = useCallback(() => seedRef.current, []);

  // Flush a still-scheduled debounce exactly once: cancel the timer first so
  // the pending callback cannot re-fire and duplicate the PUT.
  const flushPendingSave = useCallback(() => {
    if (saveTimerRef.current === null) return;
    clearPendingSave();
    flushSave();
  }, [clearPendingSave, flushSave]);

  // Unmount (match end, navigation) must not swallow a pending debounced
  // save — the account column is the source of truth, so flush immediately;
  // fetch is not aborted by React teardown.
  useEffect(
    () => () => {
      flushPendingSave();
    },
    [flushPendingSave],
  );

  // Tab close and reload never run React cleanup; pagehide is the last
  // reliable hook. keepalive on the flush covers the actual unload.
  useEffect(() => {
    const flushOnPageHide = () => flushPendingSave();
    window.addEventListener("pagehide", flushOnPageHide);
    return () => window.removeEventListener("pagehide", flushOnPageHide);
  }, [flushPendingSave]);

  const value = useMemo<FabAutomationSettingsContextValue>(
    () => ({
      priorityMode: state.seed.priorityMode,
      countdownSpeed: state.seed.countdownSpeed,
      autoOrderTriggers: state.seed.autoOrderTriggers,
      autoSelectSingletonTargets: state.seed.autoSelectSingletonTargets,
      playAndSkipHoldCardIds: new Set(state.seed.playAndSkipHoldCardIds),
      opponentTriggerYieldCardIds: new Set(state.seed.opponentTriggerYieldCardIds),
      declinedCanonicalIds: new Set(state.seed.optionalTriggerDeclines),
      acceptedCanonicalIds: new Set(state.seed.optionalTriggerAccepts),
      ready: state.ready,
      setPriorityMode,
      setCountdownSpeed,
      setAutoOrderTriggers,
      setAutoSelectSingletonTargets,
      setCardOptionalMode,
      setPlayAndSkipHoldCard,
      setOpponentTriggerYieldCard,
      readSeed,
    }),
    [
      readSeed,
      setAutoOrderTriggers,
      setAutoSelectSingletonTargets,
      setCardOptionalMode,
      setCountdownSpeed,
      setOpponentTriggerYieldCard,
      setPlayAndSkipHoldCard,
      setPriorityMode,
      state.ready,
      state.seed,
    ],
  );

  return (
    <FabAutomationSettingsContext.Provider value={value}>
      {children}
    </FabAutomationSettingsContext.Provider>
  );
}

/** Practice-fixture automation seed for one seat; undefined while unhydrated. */
export interface FabSeatAutomationSeed {
  readonly automationPreferences: Readonly<
    Partial<
      Record<
        string,
        {
          priorityMode: FabPriorityAutomationMode;
          autoOrderTriggers: boolean;
          autoSelectSingletonTargets: boolean;
          playAndSkipHoldCardIds: readonly string[];
          opponentTriggerYieldCardIds: readonly string[];
        }
      >
    >
  >;
  readonly optionalTriggerDeclines: Readonly<
    Partial<Record<string, Readonly<Record<string, true>>>>
  >;
  readonly optionalTriggerAccepts: Readonly<
    Partial<Record<string, Readonly<Record<string, true>>>>
  >;
}

/**
 * Build the practice-fixture automation seed for the human seat from the
 * provider's latest values. Returns undefined until the provider is ready so
 * unhydrated matches fail closed to the engine defaults (always-hold, ask)
 * instead of a wrong saved default.
 */
export function fabAutomationSeedForSeat(
  settings: FabAutomationSettingsContextValue,
  playerId: string,
): FabSeatAutomationSeed | undefined {
  if (!settings.ready) return undefined;
  const {
    priorityMode,
    autoOrderTriggers,
    autoSelectSingletonTargets,
    playAndSkipHoldCardIds,
    opponentTriggerYieldCardIds,
    optionalTriggerDeclines,
    optionalTriggerAccepts,
  } = settings.readSeed();
  return {
    automationPreferences: {
      [playerId]: {
        priorityMode,
        autoOrderTriggers,
        autoSelectSingletonTargets,
        playAndSkipHoldCardIds: [...playAndSkipHoldCardIds],
        opponentTriggerYieldCardIds: [...opponentTriggerYieldCardIds],
      },
    },
    optionalTriggerDeclines:
      optionalTriggerDeclines.length > 0
        ? {
            [playerId]: Object.fromEntries(
              optionalTriggerDeclines.map((canonicalId) => [canonicalId, true as const]),
            ),
          }
        : {},
    optionalTriggerAccepts:
      optionalTriggerAccepts.length > 0
        ? {
            [playerId]: Object.fromEntries(
              optionalTriggerAccepts.map((canonicalId) => [canonicalId, true as const]),
            ),
          }
        : {},
  };
}

export function useFabAutomationSettings(): FabAutomationSettingsContextValue {
  return useContext(FabAutomationSettingsContext);
}
