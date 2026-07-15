import { useCallback, useMemo } from "react";

import {
  useGundamGame,
  useInteractionView,
  usePriorityHolder,
  type MoveName,
} from "../../game/index.ts";
import { m } from "../../lib/i18n/messages.ts";
import { useSubmitError } from "../containers/submit-error-context.tsx";
import { Button } from "../primitives/index.ts";

/**
 * Unified primary-action button. Replaces the previous `PassTurnButton`
 * and `BattleControlsContainer`, both of which rendered to the same
 * top-right cockpit slot but each only handled their own pass move.
 *
 * The button picks whichever pass action the protocol view currently exposes
 * — only one of these is ever offered at a time, by
 * construction in the engine flow:
 *
 *   passBlock         (battle-phase, block-step)
 *   passBattleAction  (battle-phase, action-step)
 *   passActionStep    (end-phase,   action-step)
 *   passTurn          (main-phase)
 *
 * Visual state is driven by `usePriorityHolder()` so the button is the
 * single visible answer to "is it my turn to act?". The viewer either
 * has priority (bright, fires the move) or doesn't (greyed, "WAITING").
 *
 * The four pass moves are detected by name. New pass moves added on the
 * engine side need an entry here and a label pair in i18n; the typed
 * `MoveName` union (re-exported from the engine) makes that change
 * surface as a TypeScript check.
 */
const PASS_PRIORITY = [
  // Order matters: when the engine offers more than one (which only
  // happens during transitional states), we surface the most specific
  // one first so the label matches the player's mental model of what
  // step they're in.
  "passBlock",
  "passBattleAction",
  "passActionStep",
  "passTurn",
] as const satisfies readonly MoveName[];

type PassMoveName = (typeof PASS_PRIORITY)[number];

interface PassLabel {
  readonly tag: string;
  readonly label: string;
}

function labelsFor(passMove: PassMoveName): PassLabel {
  switch (passMove) {
    case "passBlock":
      return {
        tag: m["sim.app.action.passBlockTag"](),
        label: m["sim.app.action.passBlockLabel"](),
      };
    case "passBattleAction":
      return {
        tag: m["sim.app.action.passBattleTag"](),
        label: m["sim.app.action.passBattleLabel"](),
      };
    case "passActionStep":
      return {
        tag: m["sim.app.action.passActionStepTag"](),
        label: m["sim.app.action.passActionStepLabel"](),
      };
    case "passTurn":
      return {
        tag: m["sim.app.passTurn.endPhaseTag"](),
        label: m["sim.app.passTurn.passLabel"](),
      };
  }
}

export function PriorityActionButton() {
  const interactionView = useInteractionView();
  const priority = usePriorityHolder();
  const { adapter } = useGundamGame();
  const { report } = useSubmitError();

  const passMove: PassMoveName | null = useMemo(() => {
    const offered = new Set(
      interactionView.status === "ready"
        ? interactionView.actions.filter((action) => action.enabled).map((action) => action.id)
        : [],
    );
    for (const candidate of PASS_PRIORITY) {
      if (offered.has(candidate)) return candidate;
    }
    return null;
  }, [interactionView]);

  const onFire = useCallback(() => {
    if (!passMove) return;
    if (!priority.isViewer) return;
    report(adapter.submit(passMove, {}));
  }, [adapter, passMove, priority.isViewer, report]);

  const canFire = priority.isViewer && passMove !== null;
  const labels = passMove
    ? labelsFor(passMove)
    : {
        tag: m["sim.app.action.waitingTag"](),
        label: m["sim.app.action.waitingLabel"](),
      };

  return (
    <Button
      onClick={onFire}
      disabled={!canFire}
      variant={canFire ? "cockpit" : "outline"}
      size="xl"
      className={`hud-corner clip-hud-12 absolute z-30 min-w-[140px] right-[22px] top-1/2 -translate-y-1/2 ${
        canFire ? "gd-blink" : ""
      }`}
      style={{
        textShadow: canFire ? "0 0 8px rgba(255,255,255,.5)" : "none",
      }}
      aria-label={labels.label}
      data-testid="primary-action"
    >
      <span
        className="gd-mono text-hud-xs font-semibold tracking-hud-label"
        style={{ color: canFire ? "#5a8dff" : "#6b7a94" }}
      >
        {labels.tag}
      </span>
      <span className="text-hud-xl tracking-hud-body">{labels.label}</span>
      <span
        className="gd-mono text-hud-2xs opacity-70 tracking-hud-wide"
        style={{ color: canFire ? "#5a8dff" : "#455272" }}
      >
        {canFire ? m["sim.app.passTurn.fireHint"]() : m["sim.app.action.waitingHint"]()}
      </span>
    </Button>
  );
}
