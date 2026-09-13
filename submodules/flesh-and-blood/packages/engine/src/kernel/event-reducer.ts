import type { FabMatchState } from "../state.ts";
import type { ProposedEvent } from "../rules/events.ts";
import type { FabEventReduction, FabRulesSnapshot } from "./transaction-kernel.ts";
import { currentFabState, isFabStateDraft, prepareFabStateWithResult } from "../copy-on-write.ts";
import { reduceZoneMoveEvent } from "../rules/reducers/zone-moves.ts";
import { reduceCombatEvent } from "../rules/reducers/combat.ts";
import { reduceAssetsTurnEvent } from "../rules/reducers/assets-turn.ts";
import { reduceCountersStatusEvent } from "../rules/reducers/counters-status.ts";
import { reduceContinuousEffectEvent } from "../rules/reducers/continuous-effects.ts";
import { reduceRulesStackEvent } from "../rules/reducers/rules-stack.ts";
import { reduceMechanicsEvent } from "../rules/reducers/mechanics.ts";

/** The only function in this module allowed to write rules-visible match state. */
export function reduceFabGameEvent(
  snapshot: FabRulesSnapshot,
  event: ProposedEvent,
): FabEventReduction | null {
  if (isFabStateDraft(snapshot)) {
    return reducePreparedFabGameEvent(snapshot as FabMatchState, event);
  }
  const prepared = prepareFabStateWithResult(currentFabState(snapshot), (state) =>
    reducePreparedFabGameEvent(state, event),
  );
  if (prepared.result === null) return null;
  return {
    state: prepared.state,
    ...(prepared.result.followUpEvents ? { followUpEvents: prepared.result.followUpEvents } : {}),
    ...(prepared.result.playerLogFacts ? { playerLogFacts: prepared.result.playerLogFacts } : {}),
  };
}

/** Mutates only an unpublished event candidate; null candidates are discarded. */
function reducePreparedFabGameEvent(
  state: FabMatchState,
  event: ProposedEvent,
): FabEventReduction | null {
  switch (event.name) {
    // --- Zone movements ---
    case "announce-card":
    case "play":
    case "move-zone":
    case "enter-arena":
    case "leave-arena":
    case "enter-or-leave-arena":
    case "put-into-graveyard":
    case "banish":
    case "destroy":
    case "dies":
    case "search":
    case "shuffle-zone":
    case "create":
    case "discard":
    case "draw":
    case "reveal":
    case "look":
    case "opt":
    case "random-token-request":
    case "roll-request":
    case "equip":
      return reduceZoneMoveEvent(state, event);

    // --- Combat ---
    case "attack":
    case "attack-target-declared":
    case "defend":
    case "defense-declaration-complete":
    case "resolve-combat-damage":
    case "advance-combat-step":
    case "hit":
    case "reaction-step":
    case "chain-link-resolve":
    case "combat-chain-close":
    case "go-again":
    case "deal-damage":
    case "dealt-damage":
    case "prevent":
    case "retarget-attack":
      return reduceCombatEvent(state, event);

    // --- Assets / turn lifecycle ---
    case "spend-assets":
    case "gain-assets":
    case "lose-game":
    case "reset-turn-assets":
    case "advance-turn":
    case "pitch":
    case "start-phase":
    case "end-phase":
    case "action-phase-start":
    case "gain-life":
    case "lose-life":
    case "pay-resources":
      return reduceAssetsTurnEvent(state, event);

    // --- Counters / status / markers ---
    case "set-status":
    case "set-tapped":
    case "counter-added":
    case "numeric-counter-added":
    case "numeric-counter-removed":
    case "counter-removed":
    case "turn-face-up":
    case "turn-face-down":
    case "awaken":
    case "change-active-face":
    case "modify-power":
    case "sharpen":
      return reduceCountersStatusEvent(state, event);
    case "activation-limit-modifier-generated": {
      const object = state.objects[event.data.object.instanceId];
      if (
        !object ||
        object.incarnation !== event.data.object.ref.incarnation ||
        !event.source ||
        event.data.count < 1 ||
        !Number.isInteger(event.data.count) ||
        event.data.turnNumber !== state.turnNumber ||
        event.data.attackAbilityIds.length === 0 ||
        state.activationLimitModifiers.some(
          (modifier) => modifier.modifierId === event.data.modifierId,
        )
      )
        return null;
      state.activationLimitModifiers.push({
        modifierId: event.data.modifierId,
        generatedSequence:
          state.activationLimitModifiers.reduce(
            (latest, modifier) => Math.max(latest, modifier.generatedSequence),
            0,
          ) + 1,
        controllerId: event.controllerId as import("../game/identity.ts").FabPlayerId,
        sourceRef: event.source.ref,
        attackSourceRef: event.data.object.ref,
        attackAbilityIds: [...event.data.attackAbilityIds],
        operation: event.data.operation,
        count: event.data.count,
        turnNumber: event.data.turnNumber,
      });
      return { state };
    }

    // --- Continuous effects ---
    case "continuous-effect-generated":
    case "continuous-effect-future-object-observed":
    case "continuous-effect-ceased":
    case "continuous-effect-applied":
    case "continuous-effect-changed":
    case "continuous-effect-stopped-applying":
    case "gain-keyword":
      return reduceContinuousEffectEvent(state, event);

    // --- Rules stack / delayed triggers / replacements ---
    case "declare-triggered-layer":
    case "remove-rules-layer":
    case "consume-random-index":
    case "expire-replacement-effects":
    case "consume-replacement-effects":
    case "consume-delayed-triggers":
    case "register-delayed-trigger":
    case "register-replacement":
    case "choose-opponent":
    case "announce-activation":
    case "activate":
      return reduceRulesStackEvent(state, event);

    // --- Keyword / mechanic events ---
    case "boost":
    case "fuse":
    case "charge":
    case "intimidate":
    case "clash-win":
    case "clash-lose":
    case "clash":
    case "clash-outcome":
    case "clash-prize":
    case "reclash-request":
    case "wager":
    case "wager-loss":
    case "wager-win":
    case "crank":
    case "usurp":
    case "transcend":
    case "complete-contract":
    case "trigger":
    case "fragment":
    case "beat-chest":
    case "crowd-cheers":
    case "protect":
    case "crowd-boos":
    case "become":
    case "transform":
    case "roll":
      return reduceMechanicsEvent(state, event);

    default:
      return assertNeverEvent(event);
  }
}

function assertNeverEvent(event: never): never {
  throw new Error(`Unhandled FAB game event: ${JSON.stringify(event)}`);
}
