import type { MoveDefinition } from "../types/commands.ts";
import { playCardMove } from "./play-card.ts";
import { sellCardMove } from "./sell-card.ts";
import { callLegendMove } from "./call-legend.ts";
import { attackUnitMove } from "./attack-unit.ts";
import { attackRivalMove } from "./attack-rival.ts";
import { useBlockerMove } from "./use-blocker.ts";
import { goSoloMove } from "./go-solo.ts";
import { passPhaseMove } from "./pass-phase.ts";
import { concedeMove } from "./concede.ts";
import { mulliganMove } from "./mulligan.ts";
import { keepHandMove } from "./keep-hand.ts";
import { gainGigMove } from "./gain-gig.ts";
import { resolveAttackMove } from "./resolve-attack.ts";
import { resolveCardToPlayMove } from "./resolve-card-to-play.ts";
import { resolveCardToMoveMove } from "./resolve-card-to-move.ts";
import { activateAbilityMove } from "./activate-ability.ts";
import { resolveSearchDeckMove } from "./resolve-search-deck.ts";
import { resolveDiscardFromHandMove } from "./resolve-discard-from-hand.ts";
import { resolveAdjustGigMove } from "./resolve-adjust-gig.ts";
import { resolveStealGigsMove } from "./resolve-steal-gigs.ts";
import { resolveTriggerMove } from "./resolve-trigger.ts";
import { resolveEffectTargetMove } from "./resolve-effect-target.ts";

/**
 * Single source of truth for every move id the engine ships. Tuple form so the
 * literal union type {@link MoveId} is derived from it, enabling exhaustive
 * switches in downstream code (e.g. the AI harness).
 */
export const MOVE_IDS = [
  "playCard",
  "sellCard",
  "callLegend",
  "attackUnit",
  "attackRival",
  "useBlocker",
  "goSolo",
  "passPhase",
  "concede",
  "mulligan",
  "keepHand",
  "gainGig",
  "resolveAttack",
  "resolveCardToPlay",
  "resolveCardToMove",
  "activateAbility",
  "resolveSearchDeck",
  "resolveDiscardFromHand",
  "resolveAdjustGig",
  "resolveStealGigs",
  "resolveTrigger",
  "resolveEffectTarget",
] as const;

export type MoveId = (typeof MOVE_IDS)[number];

export const allMoves: Record<MoveId, MoveDefinition<any>> = {
  playCard: playCardMove,
  sellCard: sellCardMove,
  callLegend: callLegendMove,
  attackUnit: attackUnitMove,
  attackRival: attackRivalMove,
  useBlocker: useBlockerMove,
  goSolo: goSoloMove,
  passPhase: passPhaseMove,
  concede: concedeMove,
  mulligan: mulliganMove,
  keepHand: keepHandMove,
  gainGig: gainGigMove,
  resolveAttack: resolveAttackMove,
  resolveCardToPlay: resolveCardToPlayMove,
  resolveCardToMove: resolveCardToMoveMove,
  activateAbility: activateAbilityMove,
  resolveSearchDeck: resolveSearchDeckMove,
  resolveDiscardFromHand: resolveDiscardFromHandMove,
  resolveAdjustGig: resolveAdjustGigMove,
  resolveStealGigs: resolveStealGigsMove,
  resolveTrigger: resolveTriggerMove,
  resolveEffectTarget: resolveEffectTargetMove,
};

export {
  playCardMove,
  sellCardMove,
  callLegendMove,
  attackUnitMove,
  attackRivalMove,
  useBlockerMove,
  goSoloMove,
  passPhaseMove,
  concedeMove,
  mulliganMove,
  keepHandMove,
  gainGigMove,
  resolveAttackMove,
  resolveCardToPlayMove,
  resolveCardToMoveMove,
  activateAbilityMove,
  resolveSearchDeckMove,
  resolveDiscardFromHandMove,
  resolveAdjustGigMove,
  resolveStealGigsMove,
  resolveTriggerMove,
  resolveEffectTargetMove,
};
