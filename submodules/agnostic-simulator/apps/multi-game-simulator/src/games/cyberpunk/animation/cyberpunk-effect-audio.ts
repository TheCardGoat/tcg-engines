import type { SimulatorAudioCueId } from "@tcg/protocol";
import { playSimulatorSound } from "@tcg/simulator-presentation/audio/sound-service";

export type CyberpunkEffectSoundId = "defeat" | "lockOn" | "wipeCharge" | "wipeImpact" | "goSolo";

export interface CyberpunkEffectAudioController {
  play(sound: CyberpunkEffectSoundId, delayMs?: number): void;
  cancelScheduled(): void;
  dispose(): void;
}

// Use the player's sound pack and volume for signature effects too.
const EFFECT_CUES: Record<CyberpunkEffectSoundId, SimulatorAudioCueId> = {
  defeat: "card.destroy",
  lockOn: "combat.block",
  wipeCharge: "effect.trigger",
  wipeImpact: "combat.hit",
  goSolo: "card.play",
};

export function createCyberpunkEffectAudio(
  getGain: () => number,
): CyberpunkEffectAudioController | null {
  if (typeof window === "undefined" || typeof navigator === "undefined") return null;
  if (navigator.userAgent.includes("jsdom")) return null;
  const timers = new Set<ReturnType<typeof setTimeout>>();
  let disposed = false;
  let generation = 0;
  const cancelScheduled = () => {
    generation++;
    for (const timer of timers) clearTimeout(timer);
    timers.clear();
  };
  return {
    play(sound, delayMs = 0) {
      if (disposed || getGain() <= 0) return;
      const scheduledGeneration = generation;
      const timer = setTimeout(
        () => {
          timers.delete(timer);
          playSimulatorSound(
            EFFECT_CUES[sound],
            () => !disposed && generation === scheduledGeneration && getGain() > 0,
          );
        },
        Math.max(0, delayMs),
      );
      timers.add(timer);
    },
    cancelScheduled,
    dispose() {
      disposed = true;
      cancelScheduled();
    },
  };
}
