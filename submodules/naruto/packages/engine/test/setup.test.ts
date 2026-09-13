import { describe, expect, it } from "vitest";

import { canAct, deciderOf } from "../src/queries";
import { applyAction } from "../src/reducer";
import {
  buildDeck,
  createInitialState,
  createPracticeState,
  defaultPreviewMatchup,
  isLegalDeck,
  PREVIEW_DECKS,
  previewDeckList,
  practiceDeckIssues,
} from "../src/setup";
import {
  CONFIRMED_STRUCTURAL_RULES,
  NARUTO_PREVIEW_RULES_PROFILE,
  PROVISIONAL_RULES,
} from "../src/rules";

describe("setup", () => {
  it("keeps the stated 51-card deck separate from the provisional 50-card Preview main deck", () => {
    expect(CONFIRMED_STRUCTURAL_RULES.totalDeckSize).toBe(51);
    expect(PROVISIONAL_RULES.mainDeckSize).toBe(50);
    expect("mainDeckSize" in CONFIRMED_STRUCTURAL_RULES).toBe(false);
    expect(NARUTO_PREVIEW_RULES_PROFILE.confirmed).toBe(CONFIRMED_STRUCTURAL_RULES);
    expect(NARUTO_PREVIEW_RULES_PROFILE.status).toBe("provisional");
  });

  it("creates a legal initial state with opening hands", () => {
    const state = createInitialState({ seed: 1 });
    expect(state.turn).toBe(1);
    expect(state.winner).toBeNull();
    expect(state.rulesProfile).toBe(NARUTO_PREVIEW_RULES_PROFILE);
    expect(state.rulesProfile.status).toBe("provisional");
    for (const playerId of ["p1", "p2"] as const) {
      const player = state.players[playerId];
      expect(player.hand).toHaveLength(PROVISIONAL_RULES.openingHand);
      expect(player.deck).toHaveLength(
        PROVISIONAL_RULES.mainDeckSize - PROVISIONAL_RULES.openingHand,
      );
      expect(player.life).toBe(PROVISIONAL_RULES.startingLeaderLife);
      expect(player.chakra).toHaveLength(CONFIRMED_STRUCTURAL_RULES.chakraCount);
      expect(player.chakra.map((chakra) => chakra.cardId)).toEqual([
        "C-001",
        "C-001",
        "C-001",
        "C-001",
        "C-001",
      ]);
      expect(player.summon.cardId).toBe("S-001");
      expect(player.summon.rested).toBe(false);
      expect(player.characters).toHaveLength(PROVISIONAL_RULES.characterSlotsShown);
      expect(player.supports).toHaveLength(PROVISIONAL_RULES.supportSlots);
    }
  });

  it("gives the second player a mulligan window before turn 1 starts", () => {
    const state = createInitialState({ seed: 1, firstPlayer: "p1" });
    expect(state.awaitingMulligan).toBe("p2");
    expect(deciderOf(state)).toBe("p2");
    // Turn has not started yet (no draw happened).
    expect(state.players.p1.hand).toHaveLength(PROVISIONAL_RULES.openingHand);
    expect(canAct(state, "p2")).toBe(false);
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
    // Conservation: still 50 main-deck cards across deck + hand.
    expect(next.players.p2.deck.length + next.players.p2.hand.length).toBe(
      PROVISIONAL_RULES.mainDeckSize,
    );
    void handBefore;
  });

  it("uses deck-out-aware redraws even for malformed restored mulligan state", () => {
    const state = createInitialState({ seed: 1, firstPlayer: "p1" });
    // Strict setup cannot create this state, but a malformed restored snapshot
    // still loses rather than silently drawing fewer than the mandatory five.
    state.players.p2.hand = [];
    state.players.p2.deck = state.players.p2.deck.slice(0, PROVISIONAL_RULES.openingHand - 1);

    const next = applyAction(state, { type: "MULLIGAN", player: "p2", keep: false });
    expect(next.winner).toBe("p1");
    expect(next.log.some((entry) => entry.key === "log.deckOut")).toBe(true);
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

  it("default matchup and all Preview decks are legal", () => {
    const matchup = defaultPreviewMatchup();
    expect(isLegalDeck(matchup.p1)).toBe(true);
    expect(isLegalDeck(matchup.p2)).toBe(true);
    for (const previewDeck of PREVIEW_DECKS) {
      expect(isLegalDeck(previewDeckList(previewDeck))).toBe(true);
    }
  });

  it("buildDeck produces legal 50-card Preview main decks for every leader", () => {
    expect(isLegalDeck(buildDeck("N-001"))).toBe(true);
    expect(isLegalDeck(buildDeck("N-012"))).toBe(true);
  });

  it("rejects an undersized deck before mandatory opening draws", () => {
    const legal = buildDeck("N-001");
    const undersized = { ...legal, cardIds: legal.cardIds.slice(0, 4) };
    expect(() => createInitialState({ decks: { p1: undersized } })).toThrow(
      "Invalid Preview deck for p1: wrongSize",
    );
  });

  it("allows provisionally invalid but runtime-safe decks in local practice", () => {
    const legal = buildDeck("N-001");
    const sandbox = {
      ...legal,
      cardIds: ["N-010", ...Array.from({ length: 6 }, () => "N-004")],
    };

    expect(practiceDeckIssues(sandbox)).toEqual([]);
    expect(() => createInitialState({ decks: { p1: sandbox } })).toThrow("wrongSize");
    expect(() => createPracticeState({ decks: { p1: sandbox } })).not.toThrow();
  });

  it("allows an empty main deck in practice and resolves the mandatory draw as deck-out", () => {
    const empty = { ...buildDeck("N-001"), cardIds: [] };
    const state = createPracticeState({ decks: { p1: empty }, firstPlayer: "p1" });

    expect(state.winner).toBe("p2");
    expect(state.log.some((entry) => entry.key === "log.deckOut")).toBe(true);
  });

  it("keeps invalid identities and setup card types out of practice", () => {
    const legal = buildDeck("N-001");
    expect(practiceDeckIssues({ ...legal, leaderId: "missing" })).toContain("unknownLeader");
    expect(practiceDeckIssues({ ...legal, cardIds: ["S-001"] })).toContain("notACharacter");
    expect(practiceDeckIssues({ ...legal, chakraCardIds: ["N-004"] })).toEqual(
      expect.arrayContaining(["wrongChakraCount", "notAChakra"]),
    );
  });
});
