import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import type { SimulatorAudioCueId } from "@tcg/protocol";
import type { CompiledAudioCue } from "@tcg/simulator-runtime/animation";
import { useSimulatorSettings } from "../settings/SimulatorSettingsProvider";
import {
  disposeSimulatorSoundService,
  initSimulatorSoundService,
  playSimulatorSound,
  setSimulatorSoundVolume,
} from "./sound-service";
import { collectScheduledSimulatorAudioCues } from "./scheduler";
import { simulatorAudioDebug } from "./debug";

export interface SimulatorAudioContextValue {
  readonly playCue: (cue: SimulatorAudioCueId) => void;
  readonly scheduleAnimationSteps: (steps: readonly CompiledAudioCue[]) => void;
  readonly cancelScheduledCues: () => void;
}

const FALLBACK_SIMULATOR_AUDIO_CONTEXT: SimulatorAudioContextValue = {
  playCue: () => undefined,
  scheduleAnimationSteps: () => undefined,
  cancelScheduledCues: () => undefined,
};

const SimulatorAudioContext = createContext<SimulatorAudioContextValue>(
  FALLBACK_SIMULATOR_AUDIO_CONTEXT,
);

export function SimulatorAudioProvider({ children }: { readonly children: React.ReactNode }) {
  const { settings } = useSimulatorSettings();
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const seenStepKeysRef = useRef<Set<string>>(new Set());

  const cancelScheduledCues = useCallback(() => {
    for (const timer of timersRef.current) {
      clearTimeout(timer);
    }
    timersRef.current.clear();
    seenStepKeysRef.current.clear();
  }, []);

  useEffect(() => {
    void initSimulatorSoundService().catch((error: unknown) => {
      simulatorAudioDebug("initialization-failed", { error: String(error) });
    });
    return () => {
      cancelScheduledCues();
      disposeSimulatorSoundService();
    };
  }, [cancelScheduledCues]);

  useEffect(() => {
    setSimulatorSoundVolume(settings.soundVolume);
    if (settings.soundVolume === 0) {
      cancelScheduledCues();
    }
  }, [cancelScheduledCues, settings.soundVolume]);

  const playCue = useCallback((cue: SimulatorAudioCueId) => {
    playSimulatorSound(cue);
  }, []);

  const scheduleAnimationSteps = useCallback(
    (steps: readonly CompiledAudioCue[]) => {
      const scheduled = collectScheduledSimulatorAudioCues(steps, seenStepKeysRef.current);
      simulatorAudioDebug("scheduled", scheduled);
      for (const { cue, delayMs } of scheduled) {
        const timer = setTimeout(() => {
          timersRef.current.delete(timer);
          playCue(cue);
        }, delayMs);
        timersRef.current.add(timer);
      }
    },
    [playCue],
  );

  const value = useMemo<SimulatorAudioContextValue>(
    () => ({ playCue, scheduleAnimationSteps, cancelScheduledCues }),
    [cancelScheduledCues, playCue, scheduleAnimationSteps],
  );

  return <SimulatorAudioContext.Provider value={value}>{children}</SimulatorAudioContext.Provider>;
}

export function SimulatorAudioBridgeProvider({
  value,
  children,
}: {
  readonly value: SimulatorAudioContextValue;
  readonly children: React.ReactNode;
}) {
  return <SimulatorAudioContext.Provider value={value}>{children}</SimulatorAudioContext.Provider>;
}

export function useSimulatorAudio(): SimulatorAudioContextValue {
  return useContext(SimulatorAudioContext);
}
