import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { DamageStrikeOverlay, type DamageStrike } from "@tcg/simulator-presentation/effects";
import { playSimulatorSound } from "@tcg/simulator-presentation/audio/sound-service";
import { usePresentationSettings } from "@tcg/simulator-presentation/settings";
import type { GrandArchiveHarnessFixture } from "./fixtureProjection";
import type { GrandArchiveCardScreenPosition } from "./board-renderer";
import { grandArchiveDamageImpacts } from "./grand-archive-damage-feedback";

/** Singleton strikes begin together, preserving simultaneous damage and retaliation. */
export function GrandArchiveDamageFeedback({
  fixture,
  positions,
  host,
  resetKey,
}: {
  fixture: GrandArchiveHarnessFixture;
  positions: ReadonlyMap<string, GrandArchiveCardScreenPosition>;
  host: RefObject<HTMLDivElement | null>;
  resetKey: string;
}) {
  const settings = usePresentationSettings();
  const latestSettings = useRef(settings);
  latestSettings.current = settings;
  const previous = useRef({ fixture, positions, resetKey });
  const [strikes, setStrikes] = useState<readonly DamageStrike[]>([]);
  const mounted = useRef(false);
  const latestResetKey = useRef(resetKey);
  latestResetKey.current = resetKey;
  const activeKeys = useRef(new Set<number>());
  activeKeys.current = new Set(strikes.map((strike) => strike.key));
  useLayoutEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const sequence = useRef(0);
  const sounded = useRef(false);
  useEffect(() => {
    const old = previous.current;
    previous.current = { fixture, positions, resetKey };
    if (
      old.resetKey !== resetKey ||
      fixture.table.status.stateVersion < old.fixture.table.status.stateVersion
    ) {
      setStrikes([]);
      return;
    }
    if (old.fixture === fixture) return;
    const rect = host.current?.getBoundingClientRect();
    if (!rect || !rect.width || !rect.height || document.hidden) return;
    const center = (id: string) => {
      const position = old.positions.get(id) ?? positions.get(id);
      return position
        ? {
            x: rect.left + (position.left * rect.width) / 100,
            y: rect.top + (position.top * rect.height) / 100,
          }
        : undefined;
    };
    const next = grandArchiveDamageImpacts(old.fixture, fixture).flatMap((impact) => {
      const target = center(impact.targetId);
      if (!target) return [];
      const source = impact.sourceId ? center(impact.sourceId) : undefined;
      return [
        {
          key: ++sequence.current,
          fromX: source?.x ?? target.x,
          fromY: source?.y ?? target.y,
          targets: [{ ...target, amount: impact.amount }],
        },
      ];
    });
    if (next.length) {
      sounded.current = false;
      setStrikes(next);
    }
  }, [fixture, positions, host, resetKey]);
  if (!strikes.length) return null;
  return createPortal(
    <div className="ga-damage-feedback" aria-hidden>
      {strikes.map((strike) => (
        <DamageStrikeOverlay
          key={strike.key}
          strike={strike}
          reduced={settings.reducedMotion}
          onImpact={() => {
            if (!sounded.current && latestSettings.current.soundEnabled && !document.hidden) {
              sounded.current = true;
              playSimulatorSound(
                "combat.hit",
                () =>
                  mounted.current &&
                  latestResetKey.current === resetKey &&
                  activeKeys.current.has(strike.key) &&
                  latestSettings.current.soundEnabled &&
                  !document.hidden,
              );
            }
          }}
          onDone={() =>
            setStrikes((current) => current.filter((entry) => entry.key !== strike.key))
          }
        />
      ))}
    </div>,
    document.body,
  );
}
