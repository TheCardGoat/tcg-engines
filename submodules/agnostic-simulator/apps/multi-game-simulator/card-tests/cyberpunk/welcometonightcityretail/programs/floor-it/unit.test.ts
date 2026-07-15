import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  registerMatchers,
  createMockUnit,
  expectEligibleTargets,
  expectNoPendingChoice,
} from "@cyberpunk-engine/testing/index.ts";
import { welcomeToNightCityRetailFloorIt } from "@tcg/cyberpunk-cards";

registerMatchers();

const floorIt = welcomeToNightCityRetailFloorIt; // program, cost 1, Quick, sell tag
const rivalUnit = createMockUnit({ id: "floorit-rival", name: "Rival Unit", cost: 3, power: 5 });

describe("Floor It", () => {
  describe("UI prompt", () => {
    it("shows the program as playable when affordable", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [floorIt],
        eddies: floorIt.cost,
        deck: 4,
      });
      expect(engine.getCardsInZone("hand", P1).length).toBeGreaterThan(0);
    });
  });

  describe("[PLAY] Give a rival Unit -1 power this turn. Draw 1.", () => {
    it("makes ANY rival Unit eligible (no cost/power gate on the target)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [floorIt], eddies: floorIt.cost, deck: 4 },
        { field: [{ card: rivalUnit }] },
      );
      engine.playCard(floorIt);
      expectEligibleTargets(engine, [rivalUnit]);
    });

    it("gives the targeted rival Unit -1 effective power for the turn, then expires", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [floorIt], eddies: floorIt.cost, deck: 4 },
        { field: [{ card: rivalUnit }] },
      );
      engine.playCard(floorIt);
      engine.resolveEffectTarget(rivalUnit);

      const target = engine.getCard(rivalUnit, "field", P2);
      // Mock base power 5 - 1 = 4 for the turn.
      expect(engine.getState()).toHaveEffectivePower({
        card: target.instanceId as string,
        value: 4,
      });

      // The -1 power is turn-duration: passing the turn lets it expire,
      // returning the Unit to its base power (5).
      engine.completeTurn({ as: P1 });
      expect(engine.getState()).toHaveEffectivePower({
        card: target.instanceId as string,
        value: 5,
      });
    });

    it("draws 1 card after applying the debuff", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [floorIt], eddies: floorIt.cost, deck: 4 },
        { field: [{ card: rivalUnit }] },
      );
      const handBefore = engine.getCardsInZone("hand", P1).length;
      const deckBefore = engine.getCardsInZone("deck", P1).length;
      engine.playCard(floorIt);
      engine.resolveEffectTarget(rivalUnit);
      // Played Floor It (-1 from hand) then drew 1 (+1) -> net 0 in hand.
      const handAfter = engine.getCardsInZone("hand", P1).length;
      expect(handAfter).toBe(handBefore);
      // Deck decreased by exactly 1 (the Floor It draw).
      expect(engine.getCardsInZone("deck", P1).length).toBe(deckBefore - 1);
    });

    it("still draws 1 when the rival has no Units (the Draw is independent of the debuff target)", () => {
      // Card text: "Give a rival Unit -1 power this turn. Draw 1." The debuff
      // target has no legal candidate, so that effect no-ops — but the
      // independent "Draw 1" still resolves.
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [floorIt], eddies: floorIt.cost, deck: 4 },
        { field: [] },
      );
      const deckBefore = engine.getCardsInZone("deck", P1).length;
      engine.playCard(floorIt);
      expectNoPendingChoice(engine);
      // Deck decreased by exactly 1 (the Floor It draw fired despite no target).
      expect(engine.getCardsInZone("deck", P1).length).toBe(deckBefore - 1);
    });

    it("moves the Program to P1 trash after resolving", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [floorIt], eddies: floorIt.cost, deck: 4 },
        { field: [{ card: rivalUnit }] },
      );
      engine.playCard(floorIt);
      engine.resolveEffectTarget(rivalUnit);
      const p1Trash = engine.getCardsInZone("trash", P1);
      expect(p1Trash.some((c) => c.definitionId === floorIt.id)).toBe(true);
    });
  });
});
