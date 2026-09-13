import type { FabCommandFor } from "../command-router.ts";
import type { FabCommandHandlerContext, FabCommandHandlerResult } from "../handler-context.ts";
import { declareFabDefenders } from "../../procedures/combat/defense.ts";
import { buildFabRulesView } from "../../rules/state-rules-view.ts";
import { isHeroAttackTarget } from "../../rules/combat-target.ts";

export function handleDefend(
  context: FabCommandHandlerContext,
  actorId: string,
  command: FabCommandFor<"defend">,
): FabCommandHandlerResult {
  const state = context.state;
  const combat = state.combat;
  if (!combat?.activeLink || combat.step !== "defend") {
    return {
      accepted: false,
      error: "Defenders can only be declared in the Defend Step.",
      errorCode: "not_defend_step",
    };
  }
  if (!combat.defenseDeclarationPending) {
    return {
      accepted: false,
      error: "Defenders have already been declared for this chain link.",
      errorCode: "defense_already_declared",
    };
  }
  if (combat.activeLink.defendingPlayerId !== actorId) {
    return {
      accepted: false,
      error: "Only the defending hero may declare defenders.",
      errorCode: "not_defending_player",
    };
  }

  const cardIds = [...command.instanceIds];
  if (!isHeroAttackTarget(state, combat.activeLink.attackTargetRef)) {
    const view = buildFabRulesView(state);
    const allProtect = cardIds.every((instanceId) => {
      const record = state.objects[instanceId];
      if (!record) return false;
      const evaluated = view.object({ instanceId, incarnation: record.incarnation });
      return evaluated?.current.keywords.some((keyword) => keyword.name === "protect") ?? false;
    });
    if (!allProtect) {
      return {
        accepted: false,
        error: "Defending cards cannot be declared when an ally or permanent is attacked.",
        errorCode: "ally_target_no_defend",
      };
    }
  }

  const declared = declareFabDefenders(state, actorId, cardIds, context.transactionOptions());
  if (!declared.accepted) return declared;
  return {
    accepted: true,
    move: "defend",
    actorId,
    state: context.state,
    outcome: { kind: "applied" },
  };
}
