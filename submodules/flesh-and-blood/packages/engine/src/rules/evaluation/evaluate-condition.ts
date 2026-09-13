import type { FabCondition } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../rules-view.ts";
import { assertNever } from "./assert-never.ts";
import type { MutableObject } from "./mutable.ts";
import { evaluateCompareAmount } from "./conditions/compare-amount.ts";
import { evaluateAnd } from "./conditions/and.ts";
import { evaluateOr } from "./conditions/or.ts";
import { evaluateNot } from "./conditions/not.ts";
import { evaluateBindingMatches } from "./conditions/binding-matches.ts";
import { evaluateHasKeyword } from "./conditions/has-keyword.ts";
import { evaluateTargetExists } from "./conditions/target-exists.ts";
import { evaluateControlObject } from "./conditions/control-object.ts";
import { evaluateZoneCount } from "./conditions/zone-count.ts";
import { evaluatePlayedThis } from "./conditions/played-this.ts";
import { evaluateTurnPlayer } from "./conditions/turn-player.ts";
import { evaluatePhaseIs } from "./conditions/phase-is.ts";
import { evaluateHasCounter } from "./conditions/has-counter.ts";
import { evaluateChainLinkCount } from "./conditions/chain-link-count.ts";
import { evaluateChainLinkProperty } from "./conditions/chain-link-property.ts";
import { evaluateAttackPower } from "./conditions/attack-power.ts";
import { evaluateAttackDefense } from "./conditions/attack-defense.ts";
import { evaluateObjectNumericComparison } from "./conditions/object-numeric-comparison.ts";
import { evaluateLifeComparison } from "./conditions/life-comparison.ts";
import { evaluateHasStatus } from "./conditions/has-status.ts";
import { evaluateIsMarked } from "./conditions/is-marked.ts";
import { evaluateEquippedCount } from "./conditions/equipped-count.ts";
import { evaluatePitchZoneHas } from "./conditions/pitch-zone-has.ts";
import { evaluateDefendedThisChainLink } from "./conditions/defended-this-chain-link.ts";
import { evaluateDamageHistory } from "./conditions/damage-dealt.ts";
import { evaluateSourceDamageDealt } from "./conditions/source-damage-dealt.ts";
import { evaluateLeftArenaCount } from "./conditions/left-arena-count.ts";
import { evaluateLastAttackThisCombatChain } from "./conditions/last-attack-this-combat-chain.ts";
import { evaluateLastAttackThisTurn } from "./conditions/last-attack-this-turn.ts";
import { evaluateLastActionThisTurn } from "./conditions/last-action-this-turn.ts";
import { evaluateMovedThisTurn } from "./conditions/moved-this-turn.ts";
import { evaluateDieResult } from "./conditions/die-result.ts";
import { evaluateBindingNumeric } from "./conditions/binding-numeric.ts";
import { evaluatePerformedThisTurn } from "./conditions/performed-this-turn.ts";
import { evaluateSwordHitThisTurn } from "./conditions/sword-hit-this-turn.ts";
import { evaluateAnotherWeaponGainedGoAgainThisTurn } from "./conditions/another-weapon-gained-go-again-this-turn.ts";
import { evaluateCombatChainAttackCount } from "./conditions/combat-chain-attack-count.ts";

export function evaluateCondition(
  condition: FabCondition,
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): boolean {
  switch (condition.type) {
    case "and":
      return evaluateAnd(condition, context, objects);
    case "or":
      return evaluateOr(condition, context, objects);
    case "not":
      return evaluateNot(condition, context, objects);
    case "compare-amount":
      return evaluateCompareAmount(condition, context, objects);
    case "binding-matches":
      return evaluateBindingMatches(condition, context, objects);
    case "binding-numeric":
      return evaluateBindingNumeric(condition, context, objects);
    case "has-keyword":
      return evaluateHasKeyword(condition, context, objects);
    case "target-exists":
      return evaluateTargetExists(condition, context, objects);
    case "control-object":
      return evaluateControlObject(condition, context, objects);
    case "zone-count":
      return evaluateZoneCount(condition, context, objects);
    case "played-this":
      return evaluatePlayedThis(condition, context, objects);
    case "turn-player":
      return evaluateTurnPlayer(condition, context, objects);
    case "phase-is":
      return evaluatePhaseIs(condition, context, objects);
    case "has-counter":
      return evaluateHasCounter(condition, context, objects);
    case "chain-link-count":
      return evaluateChainLinkCount(condition, context, objects);
    case "combat-chain-attack-count":
      return evaluateCombatChainAttackCount(condition, context, objects);
    case "chain-link-property":
      return evaluateChainLinkProperty(condition, context, objects);
    case "attack-power":
      return evaluateAttackPower(condition, context, objects);
    case "attack-defense":
      return evaluateAttackDefense(condition, context, objects);
    case "object-numeric-comparison":
      return evaluateObjectNumericComparison(condition, context, objects);
    case "life-comparison":
      return evaluateLifeComparison(condition, context, objects);
    case "has-status":
      return evaluateHasStatus(condition, context, objects);
    case "source-is-subcard-of-host": {
      const sourceId = context.source?.instanceId;
      if (sourceId === undefined) return false;
      const otherThan = condition.hostOtherThan?.toLowerCase();
      return [...objects.values()].some((object) => {
        if (object.input.underInstanceIds?.includes(sourceId) !== true) return false;
        // CR materials like the DYN Ash pair with one named dragon; hosting
        // under any other permanent arms the rider, their named host does not.
        // Identity is authoritative on base properties — `current` is not
        // projected yet at early evaluation stages.
        const names = [...(object.input.current?.names ?? []), ...object.input.base.names];
        return !otherThan || !names.some((name) => name.toLowerCase() === otherThan);
      });
    }
    case "is-marked":
      return evaluateIsMarked(condition, context, objects);
    case "equipped-count":
      return evaluateEquippedCount(condition, context, objects);
    case "pitch-zone-has":
      return evaluatePitchZoneHas(condition, context, objects);
    case "defended-this-chain-link":
      return evaluateDefendedThisChainLink(condition, context, objects);
    case "damage-dealt":
    case "damage-taken":
      return evaluateDamageHistory(condition, context, objects);
    case "source-damage-dealt":
      return evaluateSourceDamageDealt(condition, context, objects);
    case "left-arena-count":
      return evaluateLeftArenaCount(condition, context, objects);
    case "last-attack-this-combat-chain":
      return evaluateLastAttackThisCombatChain(condition, context, objects);
    case "last-attack-this-turn":
      return evaluateLastAttackThisTurn(condition, context, objects);
    case "last-action-this-turn":
      return evaluateLastActionThisTurn(condition, context, objects);
    case "moved-this-turn":
      return evaluateMovedThisTurn(condition, context, objects);
    case "die-result":
      return evaluateDieResult(condition, context, objects);
    case "performed-this-turn":
      return evaluatePerformedThisTurn(condition, context, objects);
    case "sword-hit-this-turn":
      return evaluateSwordHitThisTurn(condition, context, objects);
    case "another-weapon-gained-go-again-this-turn":
      return evaluateAnotherWeaponGainedGoAgainThisTurn(condition, context, objects);
    default:
      return assertNever(condition, "FabCondition.type");
  }
}
