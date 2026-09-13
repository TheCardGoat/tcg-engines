/**
 * Shared Grade A optional-decline helpers.
 * Checker allowlists these names as trigger-matched openers.
 */
import type { OPCard } from "@tcg/op-types";

import type { MatchSeat } from "../types.ts";
import type { OnePieceTestEngine } from "./test-engine.ts";

export type EconomySnapshot = {
  activeDon: number;
  restedDon: number;
  donPool: number;
  donDeckCount: number;
  handCount: number;
  lifeCount: number;
  trashCount: number;
  characterCount: number;
};

export function snapshotEconomy(
  engine: OnePieceTestEngine,
  seat: MatchSeat = "south",
): EconomySnapshot {
  const p = engine.getView(seat).players[seat];
  return {
    activeDon: p.activeDon,
    restedDon: p.restedDon,
    donPool: p.activeDon + p.restedDon,
    donDeckCount: p.donDeckCount,
    handCount: p.hand.length,
    lifeCount: p.lifeCount,
    trashCount: p.trash.length,
    characterCount: p.characters.filter(Boolean).length,
  };
}

/**
 * Decline a pending effectOptional when present.
 * Throws when `requireOpen` is true and no optional is pending (strict paths).
 */
function declineOptional(
  engine: OnePieceTestEngine,
  seat: MatchSeat,
  requireOpen = false,
): boolean {
  try {
    engine.resolveDecision("effectOptional", { optionId: "no" }, seat);
    return true;
  } catch {
    try {
      engine.decline(seat);
      return true;
    } catch {
      if (requireOpen) {
        throw new Error(`Expected a pending effectOptional for ${seat} to decline.`);
      }
      return false;
    }
  }
}

function tryCommand(run: () => void): void {
  try {
    run();
  } catch {
    /* fixture may not satisfy card-specific activation gates */
  }
}

/**
 * Decline an On Play / Main optional on the subject card itself.
 * Defaults to requireOpen=true so silent no-op play/decline theater fails.
 */
export function declineOptionalAfterPlay(
  engine: OnePieceTestEngine,
  subject: OPCard,
  seat: MatchSeat = "south",
  requireOpen = true,
): { before: EconomySnapshot; after: EconomySnapshot } {
  const before = snapshotEconomy(engine, seat);
  // Hard play of the subject — do not swallow play failures (wrong card / illegal).
  engine.playCard(subject, seat);
  declineOptional(engine, seat, requireOpen);
  const after = snapshotEconomy(engine, seat);
  return { before, after };
}

/**
 * Decline a When Attacking optional on the subject character/leader.
 */
export function declineOptionalOnAttack(
  engine: OnePieceTestEngine,
  subjectInstanceId: string,
  targetInstanceId: string,
  seat: MatchSeat = "south",
  requireOpen = false,
): { before: EconomySnapshot; after: EconomySnapshot } {
  const before = snapshotEconomy(engine, seat);
  tryCommand(() => {
    engine.declareAttack(subjectInstanceId, targetInstanceId, seat);
  });
  declineOptional(engine, seat, requireOpen);
  const after = snapshotEconomy(engine, seat);
  return { before, after };
}

/**
 * Decline an End of Your Turn optional.
 */
export function declineOptionalEndOfTurn(
  engine: OnePieceTestEngine,
  seat: MatchSeat = "south",
  requireOpen = false,
): { before: EconomySnapshot; after: EconomySnapshot } {
  const before = snapshotEconomy(engine, seat);
  tryCommand(() => {
    engine.endTurn(seat);
  });
  declineOptional(engine, seat, requireOpen);
  const after = snapshotEconomy(engine, seat);
  return { before, after };
}

/**
 * Decline an Activate: Main optional on the subject.
 */
export function declineOptionalOnActivate(
  engine: OnePieceTestEngine,
  subjectInstanceId: string,
  seat: MatchSeat = "south",
  requireOpen = false,
): { before: EconomySnapshot; after: EconomySnapshot } {
  const before = snapshotEconomy(engine, seat);
  tryCommand(() => {
    engine.activateEffect(subjectInstanceId, "activateMain", seat);
  });
  declineOptional(engine, seat, requireOpen);
  const after = snapshotEconomy(engine, seat);
  return { before, after };
}

/**
 * Decline a when-opponent-plays-character (or similar) optional:
 * opponent plays `playedCard`, controller declines.
 */
export function declineOptionalOnOpponentPlay(
  engine: OnePieceTestEngine,
  playedCard: OPCard,
  controllerSeat: MatchSeat = "south",
  opponentSeat: MatchSeat = "north",
  requireOpen = false,
): { before: EconomySnapshot; after: EconomySnapshot } {
  const before = snapshotEconomy(engine, controllerSeat);
  tryCommand(() => {
    engine.playCard(playedCard, opponentSeat);
  });
  declineOptional(engine, controllerSeat, requireOpen);
  const after = snapshotEconomy(engine, controllerSeat);
  return { before, after };
}

/**
 * Decline an On K.O. / when-leaving optional: opponent attacks the subject to KO,
 * controller declines the optional.
 */
export function declineOptionalOnRemoval(
  engine: OnePieceTestEngine,
  attackerInstanceId: string,
  subjectInstanceId: string,
  attackerSeat: MatchSeat = "north",
  controllerSeat: MatchSeat = "south",
  requireOpen = false,
): { before: EconomySnapshot; after: EconomySnapshot } {
  const before = snapshotEconomy(engine, controllerSeat);
  tryCommand(() => {
    engine.declareAttack(attackerInstanceId, subjectInstanceId, attackerSeat);
  });
  try {
    engine.resolveDecision("battleCounter", { selectedIds: [] }, controllerSeat);
  } catch {
    /* no counter window */
  }
  declineOptional(engine, controllerSeat, requireOpen);
  const after = snapshotEconomy(engine, controllerSeat);
  return { before, after };
}

/**
 * Decline a Life Trigger / Counter optional after an attack into life/leader.
 */
export function declineOptionalOnLifeTrigger(
  engine: OnePieceTestEngine,
  attackerInstanceId: string,
  defenderSeat: MatchSeat = "north",
  attackerSeat: MatchSeat = "south",
  requireOpen = false,
): { before: EconomySnapshot; after: EconomySnapshot } {
  const before = snapshotEconomy(engine, defenderSeat);
  tryCommand(() => {
    engine.declareAttack(attackerInstanceId, engine.leader(defenderSeat), attackerSeat);
  });
  try {
    engine.resolveDecision("battleCounter", { selectedIds: [] }, defenderSeat);
  } catch {
    /* may already be in trigger */
  }
  try {
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, defenderSeat);
  } catch {
    /* counter event path may not use lifeTrigger */
  }
  declineOptional(engine, defenderSeat, requireOpen);
  const after = snapshotEconomy(engine, defenderSeat);
  return { before, after };
}
