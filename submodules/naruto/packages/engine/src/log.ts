/**
 * Game log helper. Entries are i18n-key based ({ turn, actor, key, values })
 * so consumers can localize; keys mirror the reference engine's catalog
 * ("log.summon", "log.hitLeader", "log.victory", ...).
 */

import type { GameState, LogActor } from "./types";

export function pushLog(
  state: GameState,
  actor: LogActor,
  key: string,
  values?: Readonly<Record<string, string | number>>,
): void {
  state.log.push({ turn: state.turn, actor, key, values });
}

/** All log keys emitted by the engine. */
export const LOG_KEYS = [
  "log.gameStart",
  "log.keepHand",
  "log.mulligan",
  "log.turnStart",
  "log.draw",
  "log.deckOut",
  "log.summon",
  "log.summonFromTrash",
  "log.summonNegated",
  "log.summonRequirementPaid",
  "log.setSupport",
  "log.addToChain",
  "log.playFromHand",
  "log.passPriority",
  "log.declareAttack",
  "log.attackInterrupted",
  "log.hitLeader",
  "log.hitCharacter",
  "log.characterTrashed",
  "log.negated",
  "log.lifeCost",
  "log.lifeGain",
  "log.chakraLocked",
  "log.koAll",
  "log.koTarget",
  "log.bounce",
  "log.powerDoubled",
  "log.supportImmune",
  "log.leaderBoost",
  "log.leaderDig",
  "log.teamBoost",
  "log.reveal",
  "log.revealNoMatch",
  "log.frozen",
  "log.recovery",
  "log.choiceCancelled",
  "log.victory",
] as const;

export type LogKey = (typeof LOG_KEYS)[number];
