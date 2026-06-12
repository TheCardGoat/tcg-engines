import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  expectAttackCandidate,
  expectNotAttackCandidate,
} from "@cyberpunk-engine/testing/index.ts";
import {
  alphaCorpoSecurity,
  alphaFloorIt,
  alphaRuthlessLowlife,
  alphaSecondhandBombus,
  alphaSwordwiseHuscle,
  spoilerHanakoArasakaInAGildedCage,
} from "@tcg/cyberpunk-cards";
import { createMockUnit } from "@cyberpunk-engine/testing/card-mocks.ts";
import { overrideDefinition } from "@cyberpunk-engine/state/card-registry.ts";

/**
 * Helper: patch the costs of the top N cards in P1's deck to specific values.
 * Swaps each top-deck instance's `definitionId` to a freshly minted mock unit
 * carrying the requested cost; the mock is registered via the registry overlay
 * so the engine resolves it like any catalog card.
 */
function patchTopDeckCosts(engine: CyberpunkTestEngine, costs: number[]): void {
  const mocks = costs.map((cost, i) =>
    createMockUnit({ id: `__patched-cost-${cost}-${i}__`, cost, power: 1 }),
  );
  for (const m of mocks) overrideDefinition(m);
  const deckCards = engine.getCardsInZone("deck", P1);
  for (let i = 0; i < mocks.length && i < deckCards.length; i++) {
    engine.judgeSetCardDefinition(deckCards[i]!, mocks[i]!.id, { as: P1 });
  }
}

function setDeckToDefinitions(
  engine: CyberpunkTestEngine,
  cards: ReadonlyArray<{ id: string }>,
): void {
  const deckCards = cards.map((def) => {
    const card = engine.getCardsInZone("deck", P1).find((c) => c.definitionId === def.id);
    if (!card) {
      throw new Error(`No deck card found for definition ${def.id}`);
    }
    return card;
  });
  engine.judgeStackDeck(deckCards, { as: P1, replace: true });
}

const hanako = spoilerHanakoArasakaInAGildedCage;

describe("Hanako Arasaka - In A Gilded Cage", () => {
  describe("UI prompt", () => {
    it("shows the unit as an attack candidate when ready", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: hanako, spent: false }],
      });
      expectAttackCandidate(engine, hanako);
    });

    it("does NOT show a spent unit as an attack candidate", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: hanako, spent: true }],
      });
      expectNotAttackCandidate(engine, hanako);
    });

    it("has no pending choice after playing (search auto-resolves)", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [hanako],
        eddies: hanako.cost,
        deck: [alphaCorpoSecurity, alphaFloorIt, alphaRuthlessLowlife],
      });
      engine.playCard(hanako);
      expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    });
  });

  describe("[PLAY] Search top 4, choose gig, add cards with matching cost, trash rest", () => {
    it("adds cards with cost equal to selected gig value to hand", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [hanako],
        eddies: hanako.cost ?? 0,
        deck: 20,
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      });

      // Set top 4 deck cards: one costs 3, three don't
      patchTopDeckCosts(engine, [3, 1, 1, 2]);

      const handBefore = engine.getHandCount(P1);

      engine.playCard(hanako);

      // hanako played (-1), one cost-3 card added (+1) → net 0
      expect(engine.getHandCount(P1)).toBe(handBefore);
    });

    it("trashes non-matching cards", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [hanako],
        eddies: hanako.cost ?? 0,
        deck: 20,
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      });

      // Set top 4: one costs 3, three cost other values
      patchTopDeckCosts(engine, [3, 1, 1, 2]);

      const trashBefore = engine.getCardsInZone("trash", P1).length;

      engine.playCard(hanako);

      const trashAfter = engine.getCardsInZone("trash", P1).length;
      // 3 non-matching cards should be trashed
      expect(trashAfter).toBe(trashBefore + 3);
    });

    it("auto-selects all matching cards (allMatching: true)", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [hanako],
        eddies: hanako.cost ?? 0,
        deck: 20,
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      });

      // Set top 4: two cost 2, two don't
      patchTopDeckCosts(engine, [2, 2, 1, 3]);

      const handBefore = engine.getHandCount(P1);

      engine.playCard(hanako);

      // No resolveSearchDeck call needed - allMatching auto-resolves
      // hand = handBefore - 1 (hanako played) + 2 (two cost-2 cards) = +1
      expect(engine.getHandCount(P1)).toBe(handBefore + 1);

      // Verify no pending choice (auto-resolved)
      const state = engine.getState();
      expect(state.G.turnMetadata.pendingChoice).toBeUndefined();
    });

    it("prompts for gig selection via binding", () => {
      // The binding auto-selects the first gig. With only one gig,
      // the ability fires normally using that gig's value.
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [hanako],
        eddies: hanako.cost ?? 0,
        deck: 20,
        gigArea: [{ dieType: "d6", faceValue: 1 }],
      });

      // Set top 4: one cost-1 card, three others
      patchTopDeckCosts(engine, [1, 3, 3, 2]);

      const handBefore = engine.getHandCount(P1);

      engine.playCard(hanako);

      // cost-1 card matches gig faceValue 1
      expect(engine.getHandCount(P1)).toBe(handBefore);
    });

    it("no matching cards: all go to trash", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [hanako],
        eddies: hanako.cost ?? 0,
        deck: 20,
        gigArea: [{ dieType: "d6", faceValue: 6 }],
      });

      // Set top 4: none cost 6
      patchTopDeckCosts(engine, [1, 2, 3, 4]);

      const trashBefore = engine.getCardsInZone("trash", P1).length;

      engine.playCard(hanako);

      const trashAfter = engine.getCardsInZone("trash", P1).length;
      expect(trashAfter).toBe(trashBefore + 4);
    });

    it("all cards match: all go to hand", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [hanako],
        eddies: hanako.cost ?? 0,
        deck: 20,
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      });

      // Set top 4: all cost 3
      patchTopDeckCosts(engine, [3, 3, 3, 3]);

      const handBefore = engine.getHandCount(P1);

      engine.playCard(hanako);

      // hanako removed (-1), 4 cards added (+4) → net +3
      expect(engine.getHandCount(P1)).toBe(handBefore + 3);
      // No cards trashed
      const trashAfter = engine.getCardsInZone("trash", P1).length;
      expect(trashAfter).toBe(0);
    });

    it("works with different gig values", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [hanako],
        eddies: hanako.cost ?? 0,
        deck: 20,
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      });

      // Set top 4: two cost 1, two others
      patchTopDeckCosts(engine, [1, 1, 3, 2]);

      const handBefore = engine.getHandCount(P1);

      engine.playCard(hanako);

      // Two cost-1 cards added, hanako removed: net +1
      expect(engine.getHandCount(P1)).toBe(handBefore + 1);
    });

    it("reveals only the top 4 and moves real matching-cost cards to hand", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [hanako],
        eddies: hanako.cost ?? 0,
        deck: [
          alphaSwordwiseHuscle,
          alphaCorpoSecurity,
          alphaFloorIt,
          alphaRuthlessLowlife,
          alphaSecondhandBombus,
        ],
        gigArea: [{ dieType: "d4", faceValue: 3 }],
      });
      setDeckToDefinitions(engine, [
        alphaSwordwiseHuscle,
        alphaCorpoSecurity,
        alphaFloorIt,
        alphaRuthlessLowlife,
        alphaSecondhandBombus,
      ]);

      engine.playCard(hanako);

      const handDefinitionIds = engine.getCardsInZone("hand", P1).map((card) => card.definitionId);
      expect(handDefinitionIds).toContain(alphaSwordwiseHuscle.id);
      expect(handDefinitionIds).toContain(alphaFloorIt.id);
      expect(handDefinitionIds).not.toContain(alphaSecondhandBombus.id);

      const trashDefinitionIds = engine
        .getCardsInZone("trash", P1)
        .map((card) => card.definitionId);
      expect(trashDefinitionIds).toContain(alphaCorpoSecurity.id);
      expect(trashDefinitionIds).toContain(alphaRuthlessLowlife.id);

      const deckDefinitionIds = engine.getCardsInZone("deck", P1).map((card) => card.definitionId);
      expect(deckDefinitionIds).toEqual([alphaSecondhandBombus.id]);
    });

    it("hand count increases by number of matched cards", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [hanako],
        eddies: hanako.cost ?? 0,
        deck: 20,
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      });

      // Set top 4: exactly 1 cost-2 card
      patchTopDeckCosts(engine, [2, 3, 3, 1]);

      const handBefore = engine.getHandCount(P1);

      engine.playCard(hanako);

      // hand = handBefore - 1 (hanako played) + 1 (one cost-2 card) → net 0
      expect(engine.getHandCount(P1)).toBe(handBefore);
    });

    it("action log shows the search", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [hanako],
        eddies: hanako.cost ?? 0,
        deck: 20,
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      });

      engine.playCard(hanako);

      const logs = engine.getEvents("actionLog");
      const revealLog = logs.find((e: any) => e.messageKey === "move.searchDeck.reveal") as any;
      expect(revealLog).toBeDefined();
      expect(revealLog.category).toBe("search");
      expect(revealLog.cardIds).toBeDefined();
      expect(revealLog.cardIds.length).toBe(4);
    });

    it("keeps search reveal and result entries in player-facing move logs", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [hanako],
        eddies: hanako.cost ?? 0,
        deck: [
          alphaSwordwiseHuscle,
          alphaCorpoSecurity,
          alphaFloorIt,
          alphaRuthlessLowlife,
          alphaSecondhandBombus,
        ],
        gigArea: [{ dieType: "d4", faceValue: 3 }],
      });
      setDeckToDefinitions(engine, [
        alphaSwordwiseHuscle,
        alphaCorpoSecurity,
        alphaFloorIt,
        alphaRuthlessLowlife,
        alphaSecondhandBombus,
      ]);

      const result = engine.playCard(hanako);

      const actionLogs = result.moveLogs.filter((log) => log.type === "action");
      expect(actionLogs.map((log) => log.messageKey)).toEqual(
        expect.arrayContaining([
          "move.playCard",
          "move.searchDeck.reveal",
          "move.resolveSearchDeck",
        ]),
      );
      const playLog = actionLogs.find((log) => log.messageKey === "move.playCard");
      const revealLog = actionLogs.find((log) => log.messageKey === "move.searchDeck.reveal");
      const resolveLog = actionLogs.find((log) => log.messageKey === "move.resolveSearchDeck");

      expect(playLog).toMatchObject({
        type: "action",
        messageKey: "move.playCard",
      });
      expect(revealLog).toMatchObject({
        type: "action",
        messageKey: "move.searchDeck.reveal",
        params: { count: 4 },
      });
      expect(resolveLog).toMatchObject({
        type: "action",
        messageKey: "move.resolveSearchDeck",
        params: { looked: 4, count: 2 },
      });
    });

    it("emits a searchPerformed event", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [hanako],
        eddies: hanako.cost ?? 0,
        deck: 20,
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      });

      engine.playCard(hanako);

      const searchEvents = engine.getEvents("searchPerformed");
      expect(searchEvents.length).toBeGreaterThan(0);
    });

    it("does not fire ability when no gig is available", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [hanako],
        eddies: hanako.cost ?? 0,
        deck: 20,
        gigArea: [],
      });

      const handBefore = engine.getHandCount(P1);

      engine.playCard(hanako);

      // Only hanako was removed from hand, no cards added
      expect(engine.getHandCount(P1)).toBe(handBefore - 1);
    });
  });
});
