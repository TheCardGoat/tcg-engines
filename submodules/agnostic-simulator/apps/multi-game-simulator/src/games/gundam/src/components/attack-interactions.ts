import type { EngineInteractionView, InteractionInput } from "@tcg/protocol";
import type { SimulatorCardAction } from "@tcg/simulator-contract";
import { createContext, useContext } from "react";

import { asMoveName } from "../game/index.ts";
import type { EngineAdapter } from "../game/adapter.ts";
import type { DirectAttackPresentation } from "./containers/direct-attack-presentation.ts";

export const DIRECT_ATTACK_TARGET = "direct";

export interface GundamAttackInteractionValue {
  readonly unitTargetingAttackerId: string | null;
  readonly cancelUnitTargeting: () => void;
}

export const GundamAttackInteractionContext = createContext<GundamAttackInteractionValue | null>(
  null,
);

export function useGundamAttackInteraction(): GundamAttackInteractionValue {
  return (
    useContext(GundamAttackInteractionContext) ?? {
      unitTargetingAttackerId: null,
      cancelUnitTargeting: () => {},
    }
  );
}

interface GundamInteractionDraftTargetState {
  readonly active: boolean;
  readonly actionId?: string;
  readonly sourceId?: string;
  readonly input?: Pick<InteractionInput, "id" | "kind">;
}

/** The dedicated battlefield overlay owns this exact Unit attack-target choice. */
export function isDedicatedUnitAttackTargeting(
  draft: GundamInteractionDraftTargetState,
  unitTargetingAttackerId: string | null,
): boolean {
  return (
    draft.active &&
    draft.actionId === "enterBattle" &&
    draft.input?.kind === "entity-selection" &&
    draft.input.id === "target" &&
    draft.sourceId !== undefined &&
    unitTargetingAttackerId === draft.sourceId
  );
}

/** Read the authoritative per-attacker target candidates from enterBattle. */
export function legalAttackTargetIds(
  adapter: EngineAdapter,
  interactionView: EngineInteractionView,
  attackerId: string,
): readonly string[] {
  const action = interactionView.actions.find((candidate) => candidate.id === "enterBattle");
  if (!action?.enabled) return [];

  const sourceInput = action.inputs.find(
    (input) => input.kind === "entity-selection" && input.role === "source",
  );
  if (sourceInput?.kind !== "entity-selection") return [];
  const source = sourceInput.candidates.find(
    (candidate) => candidate.entity.kind === "card" && candidate.entity.instanceId === attackerId,
  );
  if (!source?.enabled) return [];

  const seed = adapter.seedForCard(asMoveName("enterBattle"), attackerId);
  const targetStep = adapter
    .describeMove(asMoveName("enterBattle"), seed)
    .find((step) => step.kind === "selectTarget" && step.role === "attackTarget");
  return targetStep?.kind === "selectTarget" ? targetStep.candidateIds : [];
}

export function splitAttackCardAction(
  action: SimulatorCardAction,
  targetIds: readonly string[],
  directPresentation: DirectAttackPresentation | null,
): readonly SimulatorCardAction[] {
  if (String(action.commandRef).split(":")[0] !== "enterBattle") return [action];

  const baseUnavailable = action.availability.kind === "disabled" ? action.availability : null;
  const directAvailable = targetIds.includes(DIRECT_ATTACK_TARGET);
  const unitTargetCount = targetIds.filter((id) => id !== DIRECT_ATTACK_TARGET).length;

  return [
    {
      ...action,
      id: `${action.id}:player`,
      label: "Attack player",
      detail: directPresentation?.actionDetail ?? "Declare an attack against the opposing player.",
      activation: "execute",
      commandRef: "enterBattle:player",
      availability:
        baseUnavailable ??
        (directAvailable
          ? { kind: "enabled" }
          : {
              kind: "disabled",
              reason: "This Unit can't choose the opposing player as its attack target.",
              reasonCode: "gundam.enterBattle.player.unavailable",
            }),
    },
    {
      ...action,
      id: `${action.id}:unit`,
      label: "Attack a Unit",
      detail:
        unitTargetCount === 1
          ? "Choose the legal enemy Unit on the battlefield."
          : `Choose one of ${unitTargetCount} legal enemy Units on the battlefield.`,
      order: action.order + 0.01,
      shortcut: "9",
      activation: "begin-selection",
      commandRef: "enterBattle:unit",
      availability:
        baseUnavailable ??
        (unitTargetCount > 0
          ? { kind: "enabled" }
          : {
              kind: "disabled",
              reason: "There is no legal enemy Unit this Unit can attack.",
              reasonCode: "gundam.enterBattle.unit.unavailable",
            }),
    },
  ];
}
