import { proposeGrandArchiveAttackDeclaration } from "../../procedures/combat/combat.ts";
import type { GrandArchiveCommandFor } from "../command-router.ts";
import type { GrandArchiveCommandTransition } from "../../kernel/command-results.ts";
import {
  evaluateGrandArchiveCondition,
  GrandArchiveUnsupportedRuleError,
  type GrandArchiveEvaluationContext,
} from "../../procedures/effects/evaluation.ts";
import type { GrandArchiveObjectId, GrandArchivePlayerId } from "../../game/identity.ts";
import type { GrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../../game/model.ts";
import { collectGrandArchiveActionRules } from "../../rules/state/rule-modifications.ts";
import type { GrandArchiveCommandHandlerContext } from "../handler-context.ts";
import { grandArchiveActivationFailure } from "./activation-failure.ts";

export function activeGrandArchiveRequiredAttackRules(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  attackerId: GrandArchiveObjectId,
  targetIds: readonly GrandArchiveObjectId[],
  playerId: GrandArchivePlayerId,
) {
  const attacker = state.objects[attackerId];
  if (
    !attacker ||
    attacker.zone !== "field" ||
    attacker.controllerId !== playerId ||
    state.turn.playerId !== playerId ||
    state.turn.phase !== "main"
  ) {
    return [];
  }
  const evaluation: GrandArchiveEvaluationContext = {
    program,
    state,
    controllerId: playerId,
    sourceId: attacker.id,
    abilityBearerId: attacker.id,
    candidateId: attacker.id,
    bindings: {},
  };
  return collectGrandArchiveActionRules({
    action: "attack",
    activationKind: "card",
    playerId,
    candidateId: attacker.id,
    fromZone: attacker.zone,
    againstIds: targetIds,
    evaluation,
  }).filter(
    (rule) =>
      rule.effect.mode === "require" &&
      (!rule.effect.condition ||
        evaluateGrandArchiveCondition(rule.effect.condition, rule.evaluation)),
  );
}

export function handleGrandArchiveDeclareAttack(
  context: GrandArchiveCommandHandlerContext,
  playerId: GrandArchivePlayerId,
  command: GrandArchiveCommandFor<"declare-attack">,
): GrandArchiveCommandTransition {
  const original = context.getState();
  try {
    return context.commit(
      proposeGrandArchiveAttackDeclaration(
        context.getProgram(),
        context.getState(),
        playerId,
        command,
      ),
    );
  } catch (error) {
    context.replaceState(original);
    if (
      error instanceof Error &&
      !(error instanceof GrandArchiveUnsupportedRuleError) &&
      activeGrandArchiveRequiredAttackRules(
        context.getProgram(),
        context.getState(),
        command.attackerId,
        command.targetIds,
        playerId,
      ).length > 0
    ) {
      return context.commit([
        {
          type: "attack-declaration-attempted",
          attackerId: command.attackerId,
          targetIds: command.targetIds,
          declared: false,
          failureReason: error.message,
          actorId: playerId,
          cause: { kind: "command", move: "declare-attack" },
        },
      ]);
    }
    return grandArchiveActivationFailure(context, error);
  }
}
