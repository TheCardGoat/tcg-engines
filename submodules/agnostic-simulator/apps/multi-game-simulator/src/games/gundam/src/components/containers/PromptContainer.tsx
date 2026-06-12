import { useCallback, useEffect, useMemo, useRef } from "react";

import { usePending } from "../../game/index.ts";
import { GamePrompt } from "../ui/GamePrompt.tsx";
import type { PromptAction } from "../ui/types.ts";
import { useSubmitError } from "./submit-error-context.tsx";

const MOVE_LABELS: Record<string, string> = {
  enterBattle: "Enter Battle",
  deployUnit: "Deploy Unit",
  deployBase: "Deploy Base",
  playCommand: "Play Command",
  assignPilot: "Assign Pilot",
  declareBlock: "Declare Block",
  activateAbility: "Activate Ability",
  resolveEffect: "Resolve Effect",
  passTurn: "Pass Turn",
  passBlock: "Pass Block",
  passBattleAction: "Pass Battle Action",
  passActionStep: "Pass Action Step",
  concede: "Concede",
  chooseFirstPlayer: "Choose First Player",
  alterHand: "Alter Hand",
  discardToHandLimit: "Discard to Hand Limit",
};

const ROLE_LABELS: Record<string, string> = {
  attacker: "attacker",
  attackTarget: "attack target",
  unit: "unit",
  pilot: "pilot",
  blocker: "blocker",
  "deploy-trigger": "deploy target",
  "discard-target": "card to discard",
};

function labelMove(name: string): string {
  return MOVE_LABELS[name] ?? name;
}

function labelRole(role: string): string {
  return ROLE_LABELS[role] ?? role;
}

function stableInputKey(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableInputKey).join(",")}]`;
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Readonly<Record<string, unknown>>).sort(([a], [b]) =>
      a.localeCompare(b),
    );
    return `{${entries.map(([key, entry]) => `${JSON.stringify(key)}:${stableInputKey(entry)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export function PromptContainer() {
  const pending = usePending();
  const { state, confirm, cancel, provide } = pending;
  const { report } = useSubmitError();
  const autoSubmitKeyRef = useRef<string | null>(null);

  const onConfirm = useCallback(() => {
    // `pending.confirm()` returns `null` when already-idle; `report`
    // passes null through unchanged so the toast only fires on real
    // engine-validate failures.
    report(confirm());
  }, [confirm, report]);
  const onCancel = useCallback(() => {
    cancel();
  }, [cancel]);

  // Auto-submit when the engine reports no remaining steps. This happens
  // for moves without a `describeProcedure` hook (the seed is the full
  // input — e.g. deployUnit, deployBase, declareBlock) and for moves
  // whose procedure has consumed every input. Engine-driven: a move that
  // wants a confirmation gate returns `[{ kind: "confirm" }]` explicitly.
  const autoSubmitKey = useMemo(() => {
    if (state.status !== "collecting") return null;
    if (state.steps.length !== 0) return null;
    return `${state.move}:${stableInputKey(state.partialInput)}`;
  }, [state]);

  useEffect(() => {
    if (autoSubmitKey === null) {
      autoSubmitKeyRef.current = null;
      return;
    }

    if (autoSubmitKeyRef.current === autoSubmitKey) return;

    autoSubmitKeyRef.current = autoSubmitKey;
    report(confirm());
  }, [autoSubmitKey, confirm, report, state.status]);

  const content = useMemo(() => {
    if (state.status !== "collecting") return null;
    const moveName = String(state.move);
    const moveLabel = labelMove(moveName);
    const step = state.steps[0];

    // AttackTargetingOverlay owns the UI for enterBattle target selection;
    // suppressing the generic prompt here avoids double banners.
    if (
      moveName === "enterBattle" &&
      step?.kind === "selectTarget" &&
      step.role === "attackTarget"
    ) {
      return null;
    }

    if (!step) {
      // Empty steps means the move auto-submits — handled by the
      // useEffect above, not by the prompt.
      return null;
    }
    if (step.kind === "confirm") {
      return {
        message: (
          <span>
            Confirm <strong>{moveLabel}</strong>?
          </span>
        ),
        actions: [
          {
            label: "Confirm",
            onClick: onConfirm,
            kind: "primary" as const,
            testId: "game-prompt-confirm",
          },
          {
            label: "Cancel",
            onClick: onCancel,
            kind: "danger" as const,
            testId: "game-prompt-cancel",
          },
        ] satisfies PromptAction[],
      };
    }
    if (step.kind === "selectTarget") {
      const n = step.maxTargets > 1 ? `${step.minTargets}–${step.maxTargets}` : "a";
      return {
        message: (
          <span>
            {moveLabel}: select {n} {labelRole(step.role)}…
          </span>
        ),
        actions: [
          {
            label: "Cancel",
            onClick: onCancel,
            kind: "danger" as const,
            testId: "game-prompt-cancel",
          },
        ] satisfies PromptAction[],
      };
    }
    if (step.kind === "selectCost") {
      return {
        message: (
          <span>
            {moveLabel}: pay cost ({step.costType})…
          </span>
        ),
        actions: [
          {
            label: "Cancel",
            onClick: onCancel,
            kind: "danger" as const,
            testId: "game-prompt-cancel",
          },
        ] satisfies PromptAction[],
      };
    }
    if (step.kind === "selectMode") {
      // `selectMode` is the picker for activated-ability mode (effect
      // index) — see `describeProcedure` in
      // `packages/engine/src/gundam/moves/core/activate-ability.ts`.
      // Each `modes[i]` has `{id, label}`; clicking a mode feeds
      // `effectIndex` (as a number) into the pending input, which lets
      // `describeProcedure` advance to its `confirm` step.
      const modeActions: PromptAction[] = step.modes.map((mode) => ({
        label: mode.label,
        onClick: () => provide("effectIndex", Number(mode.id)),
        kind: "primary" as const,
        testId: `game-prompt-mode-${mode.id}`,
      }));
      return {
        message: <span>{moveLabel}: choose a mode…</span>,
        actions: [
          ...modeActions,
          {
            label: "Cancel",
            onClick: onCancel,
            kind: "danger" as const,
            testId: "game-prompt-cancel",
          },
        ] satisfies PromptAction[],
      };
    }
    return null;
  }, [state, onConfirm, onCancel, provide]);

  if (!content) return null;

  return <GamePrompt message={content.message} actions={content.actions} />;
}
