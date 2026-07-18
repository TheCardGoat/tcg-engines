import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { copyTextToClipboard, safeStringify } from "@tcg/simulator-runtime/debug";
import type { BotDecisionRecord, MatchRuntime } from "@tcg/gundam-engine";

import type { BotPlayMode, BotSpeed, StrategyBotHandle } from "./strategy-bot.ts";
import type { DevRuntimeBotHandle } from "../dev-runtime.ts";
import { useGundamGame } from "../context.tsx";

/**
 * Context published by a {@link VsAiProvider}. Lets UI components read
 * and drive a running bot without drilling the handle through every
 * container.
 *
 * Returns `null` outside a provider — `vs-ai-demo` is the only
 * fixture that mounts a provider today, so most sim pages see `null`
 * and hide AI controls entirely.
 */
export interface VsAiContextValue {
  readonly mode: BotPlayMode;
  readonly speed: BotSpeed;
  readonly strategyName: string;
  readonly setMode: (mode: BotPlayMode) => void;
  readonly setSpeed: (speed: BotSpeed) => void;
  readonly stepOnce: () => void;
}

const VsAiContext = createContext<VsAiContextValue | null>(null);

export interface VsAiDiagnosticsContextValue {
  readonly getDecisionCount: () => number;
  readonly subscribe: (listener: () => void) => () => void;
  readonly clearDecisions: () => void;
  readonly copySnapshot: () => Promise<void>;
  readonly restartScenario?: () => void;
}

const VsAiDiagnosticsContext = createContext<VsAiDiagnosticsContextValue | null>(null);

export interface VsAiProviderProps {
  readonly bot: StrategyBotHandle | DevRuntimeBotHandle;
  readonly runtime: MatchRuntime;
  readonly onRestartScenario?: () => void;
  readonly children: ReactNode;
}

/**
 * Wraps a running {@link StrategyBotHandle} with React state so that
 * control-panel toggles re-render as the bot's mode / speed change.
 *
 * The handle itself is imperative (plain getters + setters) to stay
 * testable without React. The provider mirrors its state into
 * `useState` so `useVsAi()` consumers re-render on toggle; imperative
 * `setMode` / `setSpeed` calls update both the handle and the state.
 */
export function VsAiProvider({ bot, runtime, onRestartScenario, children }: VsAiProviderProps) {
  const { adapter } = useGundamGame();
  const [mode, setModeState] = useState<BotPlayMode>(() => bot.getMode());
  const [speed, setSpeedState] = useState<BotSpeed>(() => bot.getSpeed());
  const [strategyName, setStrategyName] = useState<string>(() => bot.getStrategyName());
  const botRef = useRef(bot);
  const modeRef = useRef(mode);
  const speedRef = useRef(speed);
  const strategyNameRef = useRef(strategyName);
  const decisionsRef = useRef<readonly BotDecisionRecord[]>([]);
  const diagnosticListenersRef = useRef(new Set<() => void>());
  botRef.current = bot;
  modeRef.current = mode;
  speedRef.current = speed;
  strategyNameRef.current = strategyName;

  const notifyDiagnostics = useCallback(() => {
    for (const listener of diagnosticListenersRef.current) listener();
  }, []);

  const subscribeDiagnostics = useCallback((listener: () => void) => {
    diagnosticListenersRef.current.add(listener);
    return () => diagnosticListenersRef.current.delete(listener);
  }, []);

  const clearDecisions = useCallback(() => {
    if (decisionsRef.current.length === 0) return;
    decisionsRef.current = [];
    notifyDiagnostics();
  }, [notifyDiagnostics]);

  const copySnapshot = useCallback(async () => {
    await copyTextToClipboard(
      safeStringify({
        copiedAt: new Date().toISOString(),
        bot: {
          mode: modeRef.current,
          speed: speedRef.current,
          strategyName: strategyNameRef.current,
          decisions: decisionsRef.current,
        },
        boardProjection: adapter.view(),
        interactionView: adapter.interactionView(),
        matchLog: adapter.moveLogs(),
        engineLog: adapter.logEntries(),
        engineLogHistory: runtime.getGameLogHistory(),
        gameState: runtime.getState(),
      }),
    );
  }, [adapter, runtime]);

  useEffect(
    () =>
      bot.subscribeDecisions((record) => {
        decisionsRef.current = [...decisionsRef.current.slice(-99), record];
        notifyDiagnostics();
      }),
    [bot, notifyDiagnostics],
  );

  // NB: the provider does NOT dispose the bot in a cleanup effect.
  // React StrictMode double-mounts in dev — on the first unmount we'd
  // tear down the bot's runtime subscription, and the re-mount would
  // NOT reattach it (the `attachStrategyBot` call happens once inside
  // the fixture loader, not on every React render). Ownership belongs
  // to the fixture; the provider only exposes a view.

  const value = useMemo<VsAiContextValue>(
    () => ({
      mode,
      speed,
      strategyName,
      setMode: (nextMode) => {
        botRef.current.setMode(nextMode);
        setModeState(nextMode);
      },
      setSpeed: (nextSpeed) => {
        botRef.current.setSpeed(nextSpeed);
        setSpeedState(nextSpeed);
      },
      stepOnce: () => {
        botRef.current.stepOnce();
        // `stepOnce` doesn't change mode/speed, but keep strategy name
        // in sync in case something else rewired the handle.
        setStrategyName(botRef.current.getStrategyName());
      },
    }),
    [mode, speed, strategyName],
  );

  const diagnosticsValue = useMemo<VsAiDiagnosticsContextValue>(
    () => ({
      getDecisionCount: () => decisionsRef.current.length,
      subscribe: subscribeDiagnostics,
      clearDecisions,
      copySnapshot,
      ...(onRestartScenario ? { restartScenario: onRestartScenario } : {}),
    }),
    [clearDecisions, copySnapshot, onRestartScenario, subscribeDiagnostics],
  );

  return (
    <VsAiContext.Provider value={value}>
      <VsAiDiagnosticsContext.Provider value={diagnosticsValue}>
        {children}
      </VsAiDiagnosticsContext.Provider>
    </VsAiContext.Provider>
  );
}

/**
 * `null` when the surrounding page isn't a vs-AI match. Use a null
 * check before rendering controls — most simulator pages shouldn't
 * show bot UI at all.
 */
export function useVsAi(): VsAiContextValue | null {
  return useContext(VsAiContext);
}

export function useVsAiDiagnostics(): VsAiDiagnosticsContextValue | null {
  return useContext(VsAiDiagnosticsContext);
}
