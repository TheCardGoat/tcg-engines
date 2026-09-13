import { Check, Flame, Flag, Shield, Swords, Zap, type LucideIcon } from "lucide-react";

import type { GundamControlState } from "../../game/index.ts";
import { cn } from "../../lib/utils.ts";
import { PriorityCommandBeacon } from "./PriorityCommandBeacon.tsx";

export const BATTLE_STEPS = [
  { id: "attack-step", label: "Attack", shortLabel: "ATK", icon: Swords },
  { id: "block-step", label: "Block", shortLabel: "BLOCK", icon: Shield },
  { id: "action-step", label: "Action", shortLabel: "ACTION", icon: Zap },
  { id: "damage-step", label: "Damage", shortLabel: "DMG", icon: Flame },
  { id: "battle-end-step", label: "Battle End", shortLabel: "END", icon: Flag },
] as const;

export type BattleStepId = (typeof BATTLE_STEPS)[number]["id"];

export interface BattleStepRibbonProps {
  readonly currentStep: string | undefined;
  readonly controlState: GundamControlState;
  readonly spectator?: boolean;
  readonly className?: string;
}

function battleStepIndex(step: string | undefined): number {
  return BATTLE_STEPS.findIndex(({ id }) => id === step);
}

/**
 * Compact, player-facing projection of Gundam rule 8-1's five battle steps.
 *
 * The component is deliberately presentation-only: the engine remains the
 * source of truth for the current step and priority holder.
 */
export function BattleStepRibbon({
  currentStep,
  controlState,
  spectator = false,
  className,
}: BattleStepRibbonProps) {
  const currentIndex = battleStepIndex(currentStep);
  const current = currentIndex >= 0 ? BATTLE_STEPS[currentIndex] : undefined;
  const priorityLabel =
    controlState.kind === "resolving"
      ? "Resolving"
      : controlState.priorityHolder === "self"
        ? spectator
          ? "Player 1 priority"
          : "Your priority"
        : spectator
          ? "Player 2 priority"
          : "Opponent priority";

  return (
    <section
      data-combat-label-obstacle
      aria-label="Battle progress"
      className={cn(
        "flex h-8 w-full min-w-0 items-stretch overflow-hidden border border-hud-accent/45 bg-hud-surface-raised font-mono text-hud-text-muted shadow-[0_3px_8px_rgba(2,6,23,.48),0_0_6px_rgba(76,195,255,.14)] clip-hud-tag-l sm:h-8",
        className,
      )}
    >
      <span className="hidden w-[4.75rem] flex-none place-items-center bg-hud-danger px-1 text-center text-hud-2xs font-black uppercase leading-tight tracking-hud-label text-white sm:grid">
        Battle
      </span>

      <ol aria-label="Battle steps" className="flex min-w-0 flex-1">
        {BATTLE_STEPS.map((step, index) => {
          const state =
            index === currentIndex ? "current" : index < currentIndex ? "complete" : "upcoming";
          const StepIcon = step.icon as LucideIcon;
          return (
            <li
              key={step.id}
              aria-label={`${step.label} Step${state === "current" ? ", current" : ""}`}
              aria-current={state === "current" ? "step" : undefined}
              data-battle-step={step.id}
              data-state={state}
              className={cn(
                "relative flex min-w-0 flex-1 items-center justify-center gap-1 border-l border-hud-border px-1 text-[length:var(--text-hud-xs)] font-extrabold uppercase tracking-[-.02em] transition-[flex-grow,background-color,color] duration-200 sm:px-1.5 sm:tracking-[.03em]",
                state === "complete" && "text-hud-accent-hot",
                state === "current" &&
                  "flex-[2.15] bg-hud-accent/20 text-hud-text shadow-[inset_0_0_0_1px_rgba(45,107,255,.4)] sm:flex-1",
                state === "upcoming" && "text-hud-text-muted",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "relative grid h-5 w-5 flex-none place-items-center sm:h-2.5 sm:w-2.5 sm:rounded-full sm:border",
                  state === "complete" &&
                    "text-hud-accent-hot sm:border-hud-accent-hot sm:bg-hud-accent/20",
                  state === "current" &&
                    "text-hud-accent-hot sm:border-hud-accent-hot sm:bg-hud-surface",
                  state === "upcoming" &&
                    "text-hud-text-muted sm:border-hud-text-muted sm:bg-hud-surface sm:text-transparent",
                )}
              >
                <StepIcon className="h-3.5 w-3.5 sm:hidden" strokeWidth={2.2} />
                {state === "complete" ? (
                  <>
                    <Check className="hidden h-2 w-2 sm:block" strokeWidth={3} />
                    <Check
                      className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-hud-surface p-px text-hud-accent-hot sm:hidden"
                      strokeWidth={3}
                    />
                  </>
                ) : state === "current" ? (
                  <span className="hidden sm:inline">•</span>
                ) : null}
              </span>
              {state === "current" ? (
                <span className="truncate sm:hidden">{step.label}</span>
              ) : null}
              <span className="hidden truncate sm:inline">{step.label}</span>
            </li>
          );
        })}
      </ol>

      <PriorityCommandBeacon controlState={controlState} spectator={spectator} responsive />

      <span className="sr-only" aria-live="polite">
        {current
          ? `Battle progress: ${current.label} Step, ${currentIndex + 1} of 5. ${priorityLabel}.`
          : `Battle in progress. ${priorityLabel}.`}
      </span>
    </section>
  );
}
