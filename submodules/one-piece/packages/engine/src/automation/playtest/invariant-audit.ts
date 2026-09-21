/**
 * Post-game rules-invariant audit for One Piece matches.
 *
 * Checks the structural facts the One Piece rules guarantee when a game
 * ends: card conservation across zones, DON!! conservation (10 per seat),
 * finish-reason consistency with the loser's life/deck, and a clean
 * prompt/resolution queue. Pure reads on the final MatchState.
 */

import type { CardZone, MatchSeat, MatchState } from "../../types.ts";

export interface InvariantViolation {
  id: string;
  detail: string;
}

export interface InvariantAuditResult {
  ok: boolean;
  checksRun: number;
  violations: InvariantViolation[];
}

const EXPECTED_DON_PER_SEAT = 10;
const MAIN_DECK_SIZE = 50;

interface Placement {
  seat: MatchSeat;
  zone: CardZone;
}

function collectPlacements(state: MatchState): Map<string, Placement> {
  const placements = new Map<string, Placement>();
  const place = (instanceId: string | null, seat: MatchSeat, zone: CardZone) => {
    if (instanceId === null) return;
    const existing = placements.get(instanceId);
    if (existing) {
      placements.set(`__duplicate__:${instanceId}:${placements.size}`, {
        seat,
        zone,
      });
      return;
    }
    placements.set(instanceId, { seat, zone });
  };

  for (const seat of ["north", "south"] as const) {
    const player = state.players[seat];
    player.deck.forEach((id) => place(id, seat, "deck"));
    player.hand.forEach((id) => place(id, seat, "hand"));
    player.life.forEach((id) => place(id, seat, "life"));
    player.trash.forEach((id) => place(id, seat, "trash"));
    player.characterArea.forEach((id) => place(id, seat, "character"));
    place(player.stageArea, seat, "stage");
    place(player.leaderInstanceId, seat, "leader");
  }
  return placements;
}

export function auditFinalState(state: MatchState): InvariantAuditResult {
  const violations: InvariantViolation[] = [];
  let checksRun = 0;
  const check = (ok: boolean, id: string, detail: string) => {
    checksRun += 1;
    if (!ok) violations.push({ id, detail });
  };

  // 1. Finished-state coherence.
  check(state.status === "finished", "status-not-finished", `status=${state.status}`);
  check(
    state.finishReason !== null,
    "missing-finish-reason",
    `winner=${state.winner} finishReason=${state.finishReason}`,
  );
  check(
    state.winner === null || state.winner === "north" || state.winner === "south",
    "bad-winner",
    `winner=${String(state.winner)}`,
  );
  check(
    state.winner !== null ||
      state.finishReason === "draw" ||
      state.finishReason === "judgeDecision",
    "no-winner-needs-draw-reason",
    `winner=${String(state.winner)} finishReason=${state.finishReason}`,
  );

  // 2. Finish reason vs the loser's zones.
  const loser = state.winner === "north" ? "south" : state.winner === "south" ? "north" : null;
  if (loser !== null && state.finishReason === "leaderDamage") {
    check(
      state.players[loser].life.length === 0,
      "leader-damage-loser-life-not-empty",
      `${loser} life=${state.players[loser].life.length}`,
    );
  }
  if (loser !== null && state.finishReason === "emptyDeck") {
    check(
      state.players[loser].deck.length === 0,
      "deck-out-loser-deck-not-empty",
      `${loser} deck=${state.players[loser].deck.length}`,
    );
  }

  // 3. Every card instance sits in exactly one real zone slot.
  const placements = collectPlacements(state);
  const duplicateKeys = [...placements.keys()].filter((k) => k.startsWith("__duplicate__:"));
  check(
    duplicateKeys.length === 0,
    "instance-in-two-zones",
    `${duplicateKeys.length} instances referenced by more than one zone slot`,
  );
  for (const [instanceId, instance] of Object.entries(state.cards)) {
    if (instance.zone === "resolution") {
      // Tracked separately below; resolution is not a player zone.
      continue;
    }
    const placement = placements.get(instanceId);
    if (!placement) {
      violations.push({
        id: "instance-missing-from-zones",
        detail: `${instanceId} (${instance.cardId}) zone=${instance.zone} not present in any seat's zone arrays`,
      });
      checksRun += 1;
      continue;
    }
    checksRun += 1;
    check(
      placement.seat === instance.owner && placement.zone === instance.zone,
      "instance-zone-mismatch",
      `${instanceId} (${instance.cardId}) state says owner=${instance.owner} zone=${instance.zone}, zone arrays say ${placement.seat}/${placement.zone}`,
    );
  }

  // 4. Nothing left mid-resolution at game end.
  const resolving = Object.values(state.cards).filter((c) => c.zone === "resolution");
  check(
    resolving.length === 0,
    "cards-still-in-resolution",
    resolving.map((c) => c.cardId).join(", "),
  );
  const pendingPrompts = state.promptQueue.filter((p) => p.status === "pending");
  check(
    pendingPrompts.length === 0,
    "pending-prompts-at-finish",
    `${pendingPrompts.length} pending`,
  );

  // 5. DON!! conservation: each seat's 10 DON!! are all on the table.
  for (const seat of ["north", "south"] as const) {
    const player = state.players[seat];
    let attached = 0;
    const stray: string[] = [];
    for (const instance of Object.values(state.cards)) {
      if (instance.owner !== seat || instance.attachedDon === 0) continue;
      attached += instance.attachedDon;
      if (
        instance.zone !== "character" &&
        instance.zone !== "leader" &&
        instance.zone !== "stage"
      ) {
        stray.push(`${instance.instanceId}(${instance.cardId},zone=${instance.zone})`);
      }
    }
    const total = player.activeDon + player.restedDon + player.donDeckCount + attached;
    check(
      total === EXPECTED_DON_PER_SEAT,
      "don-conservation",
      `${seat} has ${total}/10 DON (active=${player.activeDon} rested=${player.restedDon} donDeck=${player.donDeckCount} attached=${attached})`,
    );
    check(stray.length === 0, "don-left-on-dead-card", `${seat}: ${stray.join(", ")}`);
    check(
      player.donDeckCount >= 0 && player.activeDon >= 0 && player.restedDon >= 0,
      "negative-don",
      `${seat}`,
    );
    check(player.life.length <= 10, "life-over-10", `${seat} life=${player.life.length}`);
  }

  // 6. Main-deck card conservation: 100 non-leader instances total.
  const nonLeaderInstances = Object.values(state.cards).filter((c) => c.zone !== "leader");
  check(
    nonLeaderInstances.length === MAIN_DECK_SIZE * 2,
    "main-deck-conservation",
    `${nonLeaderInstances.length} non-leader instances (expected ${MAIN_DECK_SIZE * 2})`,
  );

  return {
    ok: violations.length === 0,
    checksRun,
    violations,
  };
}
