import { useCallback, useEffect, useMemo, useState } from "react";

import {
  useGundamGame,
  useInteractionView,
  usePriorityHolder,
  type MoveName,
} from "../../game/index.ts";
import { m } from "../../lib/i18n/messages.ts";
import { hasOpenTurnActions } from "../../lib/pass-turn-confirmation.ts";
import { usePassHotkey } from "../../lib/use-pass-hotkey.ts";
import { useGundamInteractionDraft } from "../../game/interaction-draft.tsx";
import { useSubmitError } from "../containers/submit-error-context.tsx";
import { requiredPrimaryAction } from "./required-action.ts";
import { Button } from "../primitives/index.ts";
import { PassTurnConfirmationDialog } from "./PassTurnConfirmationDialog.tsx";

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
  /** Longer guidance shown in title / tooltip; optional for waiting states. */
  readonly hint?: string;
}

function labelsFor(passMove: PassMoveName): PassLabel {
  switch (passMove) {
    case "passBlock":
      return {
        tag: m["sim.app.action.passBlockTag"](),
        label: m["sim.app.action.passBlockLabel"](),
        hint: m["sim.app.action.passBlockHint"](),
      };
    case "passBattleAction":
      return {
        tag: m["sim.app.action.passBattleTag"](),
        label: m["sim.app.action.passBattleLabel"](),
        hint: m["sim.app.action.passBattleHint"](),
      };
    case "passActionStep":
      return {
        tag: m["sim.app.action.passActionStepTag"](),
        label: m["sim.app.action.passActionStepLabel"](),
        hint: m["sim.app.action.passActionStepHint"](),
      };
    case "passTurn":
      return {
        tag: m["sim.app.passTurn.endPhaseTag"](),
        label: m["sim.app.passTurn.passLabel"](),
      };
  }
}

export function PriorityActionButton({
  embedded = false,
  compact = false,
}: {
  readonly embedded?: boolean;
  readonly compact?: boolean;
}) {
  const interactionView = useInteractionView();
  const priority = usePriorityHolder();
  const { adapter } = useGundamGame();
  const { report } = useSubmitError();
  const draft = useGundamInteractionDraft();
  const [confirmPassTurnOpen, setConfirmPassTurnOpen] = useState(false);

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

  const hasOpenActions = useMemo(
    () =>
      passMove === "passTurn" &&
      interactionView.status === "ready" &&
      hasOpenTurnActions(interactionView.actions),
    [interactionView, passMove],
  );
  const required = useMemo(() => requiredPrimaryAction(interactionView), [interactionView]);

  const submitPass = useCallback(() => {
    if (!passMove) return;
    if (!priority.isViewer) return;
    report(adapter.submit(passMove, {}));
  }, [adapter, passMove, priority.isViewer, report]);

  const confirmPassTurn = useCallback(() => {
    setConfirmPassTurnOpen(false);
    submitPass();
  }, [submitPass]);

  // An enabled pass action in the published view means this seat owes (or may
  // answer) a decision even while `status.activePlayer` still names the
  // opponent — e.g. the end-phase action step of the opponent's turn. Gating
  // the button on `priority.isViewer` alone rendered it disabled in exactly
  // those states, leaving the seat no way to respond and stalling the match.
  const canFire =
    !draft.active &&
    ((required !== null && priority.isViewer) ||
      (passMove !== null && (priority.isViewer || passMove !== "passTurn")));
  const requestPass = useCallback(() => {
    if (!canFire) return;
    if (required) {
      draft.begin(required.id, {});
      return;
    }
    if (passMove === "passTurn" && hasOpenActions) {
      setConfirmPassTurnOpen(true);
      return;
    }
    submitPass();
  }, [canFire, draft, hasOpenActions, passMove, required, submitPass]);

  usePassHotkey(canFire, requestPass);

  useEffect(() => {
    if (confirmPassTurnOpen && (!canFire || passMove !== "passTurn" || !hasOpenActions)) {
      setConfirmPassTurnOpen(false);
    }
  }, [canFire, confirmPassTurnOpen, hasOpenActions, passMove]);

  const labels = required
    ? { tag: "REQUIRED ACTION", label: required.label, hint: required.hint }
    : passMove
      ? labelsFor(passMove)
      : {
          tag: m["sim.app.action.waitingTag"](),
          label: m["sim.app.action.waitingLabel"](),
        };
  const guidance = labels.hint ?? labels.label;
  const title = canFire
    ? labels.hint
      ? `${labels.label} — ${labels.hint} (Space)`
      : `${labels.label} (Space)`
    : labels.label;

  return (
    <>
      <Button
        onClick={requestPass}
        disabled={!canFire}
        variant={canFire ? "cockpit" : "outline"}
        size={embedded ? "md" : "xl"}
        className={`hud-corner ${
          embedded
            ? `h-full min-w-0 w-full clip-hud-6 ${compact ? "flex-col gap-0 px-1" : ""}`
            : "absolute z-30 min-w-[140px] right-[22px] top-1/2 -translate-y-1/2 clip-hud-12"
        } ${canFire && embedded ? "gd-action-ready" : ""}`}
        style={{
          textShadow: canFire ? "0 1px 2px rgba(40,0,18,.55)" : "none",
          color: canFire ? "oklch(0.98 0.006 255)" : "var(--color-hud-text-dim)",
        }}
        aria-label={canFire && labels.hint ? `${labels.label}. ${guidance}` : labels.label}
        aria-keyshortcuts="Space"
        title={title}
        data-testid="primary-action"
      >
        {!embedded && (
          <span
            className="gd-mono text-hud-xs font-semibold tracking-hud-label"
            style={{ color: canFire ? "#5a8dff" : "#6b7a94" }}
          >
            {labels.tag}
          </span>
        )}
        {embedded && canFire && !compact && (
          <span className="gd-action-beacon" aria-hidden="true" />
        )}
        <span
          className={`${compact ? "text-hud-lg leading-none" : "text-hud-xl"} tracking-hud-body`}
        >
          {labels.label}
        </span>
        {embedded && canFire && (
          <kbd
            aria-hidden="true"
            className={`gd-mono text-hud-2xs font-semibold leading-none text-white/90 ${
              compact
                ? "tracking-hud-label"
                : "rounded-sm border border-white/35 bg-black/20 px-1.5 py-0.5 tracking-hud-label shadow-[0_1px_2px_rgba(0,0,0,.3)]"
            }`}
          >
            SPACE
          </kbd>
        )}
        {!embedded && (
          <span
            className="gd-mono text-hud-2xs opacity-70 tracking-hud-wide"
            style={{ color: canFire ? "#5a8dff" : "#455272" }}
          >
            {canFire ? m["sim.app.passTurn.fireHint"]() : m["sim.app.action.waitingHint"]()}
          </span>
        )}
      </Button>

      <PassTurnConfirmationDialog
        open={confirmPassTurnOpen}
        onOpenChange={setConfirmPassTurnOpen}
        onConfirm={confirmPassTurn}
      />
    </>
  );
}
