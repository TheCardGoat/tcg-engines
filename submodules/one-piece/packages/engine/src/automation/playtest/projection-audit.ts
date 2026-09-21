/**
 * Hidden-information leakage audit for One Piece playtest games.
 *
 * A seat's projected log must never name cards that are hidden from that
 * seat — specifically cards still sitting in the opponent's final hand or
 * deck. A name is KNOWN to a viewer when the engine intentionally disclosed
 * it to them: a PUBLIC line, or a private message addressed to that viewer
 * (own draws, own deck looks). The audit flags a hidden opponent name that
 * reaches the viewer OUTSIDE those channels — the Page-One masking-bug
 * class. Zero false positives prioritized; instance-level attribution
 * would require replay instrumentation.
 */

import type { MatchSeat, MatchState } from "../../types.ts";
import { projectStateForSeat } from "../../projection.ts";
import { cardName, getCardForInstance } from "../../shared.ts";

export interface LeakCandidate {
  viewer: MatchSeat;
  owner: MatchSeat;
  where: "hand" | "deck";
  name: string;
  line: string;
}

export interface ProjectionAuditResult {
  ok: boolean;
  checkedNames: number;
  leaks: LeakCandidate[];
}

const SEATS: readonly MatchSeat[] = ["north", "south"];

export function auditSeatLeakage(state: MatchState): ProjectionAuditResult {
  const leaks: LeakCandidate[] = [];
  let checkedNames = 0;
  for (const viewer of SEATS) {
    // A name is KNOWN to a viewer when the engine intentionally disclosed it
    // to them: any PUBLIC line (face-up plays, named triggers/prompts) or a
    // private message addressed to that viewer (own draws, own deck looks).
    // Only a hidden name disclosed OUTSIDE those channels — e.g. a public
    // line naming an opponent's hand card — is a leak (the Page-One class).
    const knownToViewer = new Set<string>();
    for (const entry of state.logHistory) {
      if (entry.visibility === "public") {
        knownToViewer.add(entry.message);
      }
      const own = entry.privateMessages[viewer];
      if (own !== undefined) {
        knownToViewer.add(own);
      }
    }
    const isKnown = (name: string): boolean => {
      for (const line of knownToViewer) {
        if (line.includes(name)) return true;
      }
      return false;
    };

    const opponent: MatchSeat = viewer === "north" ? "south" : "north";
    const opponentPlayer = state.players[opponent];
    const hidden: Array<{ name: string; where: "hand" | "deck" }> = [];
    for (const instanceId of opponentPlayer.hand) {
      hidden.push({ name: cardName(getCardForInstance(state, instanceId)), where: "hand" });
    }
    for (const instanceId of opponentPlayer.deck) {
      hidden.push({ name: cardName(getCardForInstance(state, instanceId)), where: "deck" });
    }

    const projectedLines = projectStateForSeat(state, viewer).logs.map((entry) => entry.message);
    for (const { name, where } of hidden) {
      if (isKnown(name)) continue;
      checkedNames += 1;
      for (const line of projectedLines) {
        if (line.includes(name)) {
          leaks.push({ viewer, owner: opponent, where, name, line });
          break;
        }
      }
    }
  }

  return { ok: leaks.length === 0, checkedNames, leaks };
}
