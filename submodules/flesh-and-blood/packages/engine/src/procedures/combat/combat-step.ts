import type { FabMatchState } from "../../state.ts";
import type { ProposedEvent } from "../../rules/events.ts";
import { executeFabEventTransaction } from "../../kernel/transaction/index.ts";
import { type FabEventTransactionOptions } from "../../kernel/process-runner/index.ts";
import { snapshotAttackSource } from "../../rules/snapshots.ts";
import { exactAttackBinding } from "../../rules/exact-attack.ts";
import { buildFabRulesView } from "../../rules/state-rules-view.ts";
import type { FabEvaluatedObject } from "../../rules/rules-view.ts";

export type FabCombatStepResult =
  | { readonly accepted: true; readonly state: FabMatchState }
  | {
      readonly accepted: false;
      readonly state: FabMatchState;
      readonly error: string;
      readonly errorCode: string;
    };

export function advanceFabCombatStep(
  current: FabMatchState,
  options: FabEventTransactionOptions,
): FabCombatStepResult {
  const combat = current.combat;
  const link = combat?.activeLink;
  if (!combat || !link) return failure(current, "There is no active combat link.", "no_combat");
  const step = combat.step;
  if (step !== "attack" && step !== "defend" && step !== "damage") {
    return failure(current, "This combat step is not migrated.", "unsupported_combat_step");
  }
  const attack = snapshotAttackSource(
    current,
    link.activeAttack,
    link.attackingPlayerId,
    "combatChain",
  );
  const attackBinding = exactAttackBinding(link.activeAttack, attack);
  const attackObject = buildFabRulesView(current).object(attack.ref);
  const hasGoAgain = attackHasGoAgainAtResolution(attackObject, link.resolvedAttackLki?.hasGoAgain);
  const result = executeFabEventTransaction(
    current,
    (processId) => {
      const base = {
        processId,
        cause: { kind: "rule" as const, rule: "combat-step", controllerId: link.attackingPlayerId },
        controllerId: link.attackingPlayerId,
        source: attack,
        affected: [attack],
        bindings: { attack: attackBinding },
      };
      if (step === "defend") {
        return [
          {
            ...base,
            name: "reaction-step" as const,
            data: {
              attackingPlayerId: link.attackingPlayerId,
              defendingPlayerId: link.defendingPlayerId,
              attack,
            },
          },
        ];
      }
      const to = step === "attack" ? ("defend" as const) : ("resolution" as const);
      const events: ProposedEvent[] = [
        {
          ...base,
          name: "advance-combat-step",
          data: { attack, from: step, to },
        },
      ];
      if (step === "damage" && hasGoAgain) {
        events.push({
          ...base,
          name: "go-again",
          data: { object: attack, controllerId: link.attackingPlayerId },
        });
      }
      return events;
    },
    options,
  );
  return result.batch
    ? { accepted: true, state: result.state }
    : failure(current, "The combat step produced no rules change.", "combat_step_no_op");
}

function failure(state: FabMatchState, error: string, errorCode: string): FabCombatStepResult {
  return { accepted: false, state, error, errorCode };
}

/**
 * CR 7.6.2 / 8.3.5b: at the start of the Resolution Step, refund if the attack
 * currently has go again (including on-hit grants such as Soulbead Strike).
 * CR 7.6.2a / 5.3.5a: if the attack is no longer on the combat chain, use last
 * known information from damage resolution (Boltyn-style on-hit movement).
 */
function attackHasGoAgainAtResolution(
  attackObject: FabEvaluatedObject | null,
  snapshotHasGoAgain: boolean | undefined,
): boolean {
  const liveHasGoAgain =
    attackObject?.current.keywords.some((keyword) => keyword.name === "go-again") === true;
  if (liveHasGoAgain) return true;
  if (attackObject?.zone.zone === "combatChain") return false;
  return snapshotHasGoAgain === true;
}
