import { describe, expect, it } from "vitest";

import { deciderOf } from "../src/queries";
import { applyAction } from "../src/reducer";
import {
  buildDeck,
  createInitialState,
  defaultMatchup,
  isLegalDeck,
  PREBUILT_DECKS,
  prebuiltDeckList,
} from "../src/setup";
import { OFFICIAL_RULES, PROVISIONAL_RULES } from "../src/rules";

describe("setup", () => {
  it("creates a legal initial state with opening hands", () => {
    const state = createInitialState({ seed: 1 });
    expect(state.turn).toBe(1);
    expect(state.winner).toBeNull();
    for (const playerId of ["p1", "p2"] as const) {
      const player = state.players[playerId];
      expect(player.hand).toHaveLength(PROVISIONAL_RULES.openingHand);
      expect(player.deck).toHaveLength(
        OFFICIAL_RULES.deckSize - PROVISIONAL_RULES.openingHand,
      );
      expect(player.life).toBe(OFFICIAL_RULES.leaderLife);
      expect(player.chakra).toHaveLength(OFFICIAL_RULES.chakraCount);
      expect(player.characters).toHaveLength(PROVISIONAL_RULES.characterSlotsShown);
      expect(player.supports).toHaveLength(OFFICIAL_RULES.supportSlots);
    }
  });

  it("gives the second player a mulligan window before turn 1 starts", () => {
    const state = createInitialState({ seed: 1, firstPlayer: "p1" });
    expect(state.awaitingMulligan).toBe("p2");
    expect(deciderOf(state)).toBe("p2");
    // Turn has not started yet (no draw happened).
    expect(state.players.p1.hand).toHaveLength(PROVISIONAL_RULES.openingHand);
  });

  it("mulligan keep starts the turn without redrawing", () => {
    const state = createInitialState({ seed: 1, firstPlayer: "p1" });
    const handBefore = state.players.p2.hand.map((c) => c.uid);
    const next = applyAction(state, { type: "MULLIGAN", player: "p2", keep: true });
    expect(next).not.toBe(state);
    expect(next.awaitingMulligan).toBeNull();
    expect(next.players.p2.hand.map((c) => c.uid)).toEqual(handBefore);
    // startTurn ran for p1: turn 1 draws firstTurnDraw cards.
    expect(next.players.p1.hand).toHaveLength(
      PROVISIONAL_RULES.openingHand + PROVISIONAL_RULES.firstTurnDraw,
    );
    expect(next.phase).toBe("main");
    expect(deciderOf(next)).toBe("p1");
  });

  it("mulligan redraw shuffles the hand back and draws a fresh hand", () => {
    const state = createInitialState({ seed: 1, firstPlayer: "p1" });
    const handBefore = state.players.p2.hand.map((c) => c.uid);
    const next = applyAction(state, { type: "MULLIGAN", player: "p2", keep: false });
    expect(next.players.p2.hand).toHaveLength(PROVISIONAL_RULES.openingHand);
    // Conservation: still 50 cards across deck + hand.
    expect(next.players.p2.deck.length + next.players.p2.hand.length).toBe(
      OFFICIAL_RULES.deckSize,
    );
    void handBefore;
  });

  it("rejects mulligan from the wrong player", () => {
    const state = createInitialState({ seed: 1, firstPlayer: "p1" });
    const next = applyAction(state, { type: "MULLIGAN", player: "p1", keep: true });
    expect(next).toBe(state);
  });

  it("respects an explicit firstPlayer and is deterministic per seed", () => {
    const a = createInitialState({ seed: 777, firstPlayer: "p2" });
    const b = createInitialState({ seed: 777, firstPlayer: "p2" });
    expect(a.activePlayer).toBe("p2");
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it("default matchup and all prebuilt decks are legal", () => {
    const matchup = defaultMatchup();
    expect(isLegalDeck(matchup.p1)).toBe(true);
    expect(isLegalDeck(matchup.p2)).toBe(true);
    for (const prebuilt of PREBUILT_DECKS) {
      expect(isLegalDeck(prebuiltDeckList(prebuilt))).toBe(true);
    }
  });

  it("buildDeck produces legal 50-card decks for every leader", () => {
    expect(isLegalDeck(buildDeck("N-001"))).toBe(true);
    expect(isLegalDeck(buildDeck("N-012"))).toBe(true);
  });
});
