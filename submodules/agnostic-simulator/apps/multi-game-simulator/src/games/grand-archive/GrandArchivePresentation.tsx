import { Group, Switch } from "@mantine/core";
import type { SimulatorAudioCueId } from "@tcg/protocol";
import { usePresentationSettings } from "@tcg/simulator-presentation/settings";
import {
  initSimulatorSoundService,
  playSimulatorSound,
} from "@tcg/simulator-presentation/audio/sound-service";
import { useEffect, useMemo, useRef } from "react";
import type { GrandArchiveHarnessFixture } from "./fixtureProjection";
import type { GrandArchiveFeedbackCue } from "./grand-archive-feedback";
import { useGrandArchiveFeedback } from "./useGrandArchiveFeedback";

/** Native confirmed changes select the same sound vocabulary as the other boards. */
export function grandArchiveFeedbackSounds(
  cues: readonly GrandArchiveFeedbackCue[],
): readonly SimulatorAudioCueId[] {
  const sounds = new Set<SimulatorAudioCueId>();
  for (const cue of cues) {
    if (cue.kind === "entity-move") {
      const zone = cue.toZoneId?.split(":").at(-1);
      if (zone === "hand") sounds.add("card.draw");
      else if (zone === "field" || zone === "effects-stack" || zone === "intent")
        sounds.add("card.play");
      else if (zone === "graveyard" || zone === "banishment") sounds.add("card.discard");
      else if (zone === "memory") sounds.add("resource.spend");
      else if (zone) sounds.add("card.move");
    } else if (cue.kind === "entity-change") sounds.add("counter.land");
    else if (cue.kind === "announcement" && cue.id.startsWith("activity:"))
      sounds.add("phase.change");
  }
  // One cue per semantic sound in a committed update, including multi-card moves.
  return [...sounds];
}

export function GrandArchivePresentationControls() {
  const settings = usePresentationSettings();
  return (
    <Group gap="xs" aria-label="Presentation settings">
      <Switch
        size="xs"
        label="Sound"
        checked={settings.soundEnabled}
        onChange={(event) => settings.setSoundEnabled(event.currentTarget.checked)}
      />
      <Switch
        size="xs"
        label="Reduce motion"
        checked={settings.reducedMotion}
        disabled={settings.systemReducedMotion}
        onChange={(event) => settings.setReducedMotion(event.currentTarget.checked)}
      />
    </Group>
  );
}

/** Never queues old sounds after loading, Undo, changing seats, or a hidden tab. */
export function GrandArchivePresentationFeedback({
  fixture,
  resetKey = 0,
}: {
  readonly fixture: GrandArchiveHarnessFixture;
  readonly resetKey?: string | number;
}) {
  const { soundEnabled } = usePresentationSettings();
  const enabled = useRef(soundEnabled);
  enabled.current = soundEnabled;
  const initialized = useRef(false);
  const live = useRef(true);
  const snapshot = useMemo(
    () => ({ table: fixture.table, entities: fixture.entities, eventLog: fixture.eventLog ?? [] }),
    [fixture.table, fixture.entities, fixture.eventLog],
  );
  const feedback = useGrandArchiveFeedback(snapshot, `${fixture.id}:${resetKey}`);
  const generation = useRef(feedback.generation);
  generation.current = feedback.generation;
  useEffect(() => {
    let mounted = true;
    live.current = true;
    const unlock = () => {
      if (!enabled.current || initialized.current) return;
      void initSimulatorSoundService()
        .then(() => {
          if (mounted) initialized.current = true;
        })
        .catch(() => {
          /* The board remains usable if audio is unavailable. */
        });
    };
    document.addEventListener("pointerdown", unlock, true);
    document.addEventListener("keydown", unlock, true);
    return () => {
      mounted = false;
      live.current = false;
      document.removeEventListener("pointerdown", unlock, true);
      document.removeEventListener("keydown", unlock, true);
    };
  }, []);
  const consumed = useRef(feedback.cues);
  useEffect(() => {
    if (consumed.current === feedback.cues) return;
    consumed.current = feedback.cues;
    if (!enabled.current || !initialized.current || document.hidden) return;
    const queuedGeneration = feedback.generation;
    for (const sound of grandArchiveFeedbackSounds(feedback.cues)) {
      playSimulatorSound(
        sound,
        () =>
          live.current &&
          generation.current === queuedGeneration &&
          enabled.current &&
          !document.hidden,
      );
    }
  }, [feedback.cues, feedback.generation]);
  return null;
}
