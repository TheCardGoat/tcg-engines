import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectCallableLegend,
} from "@cyberpunk-engine/testing/index.ts";
import {
  spoilerPanamPalmerNomadCavalry,
  spoilerGorillaArms,
  spoilerRidingNomad,
  alphaRuthlessLowlife,
} from "@tcg/cyberpunk-cards";

const panam = spoilerPanamPalmerNomadCavalry;
const gorillaArms = spoilerGorillaArms;
const ridingNomad = spoilerRidingNomad;
const lowlife = alphaRuthlessLowlife; // P2 attacker

const CALL_COST = 1; // Panam's RAM cost

describe("Panam Palmer - Nomad Cavalry", () => {
  describe("UI prompt", () => {
    it("shows the legend as callable when face-down", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: panam, faceDown: true }],
        eddies: 1,
      });
      expectCallableLegend(engine, panam);
    });

    it("has no pending choice after calling (CALL Ready auto-applies)", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [panam],
        eddies: CALL_COST,
      });
      engine.callLegend(panam);
      expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    });
  });

  // ── CALL ──────────────────────────────────────────────────────────────

  describe(`CALL Ready this Legend.`, () => {
    it("Panam is face-up after being called", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [panam],
        eddies: CALL_COST,
      });

      engine.callLegend(panam);

      expect(engine.getCard(panam, "legendArea", P1).meta.faceDown).toBe(false);
    });

    it("Panam is ready (not spent) after being called", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [panam],
        eddies: CALL_COST,
      });

      engine.callLegend(panam);

      expect(engine.getCard(panam, "legendArea", P1).meta.spent).toBe(false);
    });
  });

  // ── ATTACK TRIGGER ────────────────────────────────────────────────────

  describe(`When a friendly Unit attacks, [Spend Icon]: Choose a Gear from this Legend and equip it to that Unit. If you do, ready that Unit.`, () => {
    function setupWithGearOnPanam() {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: panam, faceDown: false }],
        field: [{ card: ridingNomad, spent: false }],
        hand: [gorillaArms],
        eddies: 4, // cost of Gorilla Arms
      });
      engine.attachGear(gorillaArms, panam);
      return engine;
    }

    it("sets a chooseCardToMove pending choice when a friendly unit attacks and Panam has gear", () => {
      const engine = setupWithGearOnPanam();

      engine.attackRival(ridingNomad);

      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice).toBeDefined();
      expect(choice!.type).toBe("chooseCardToMove");
    });

    it("Panam is spent after the ability triggers", () => {
      const engine = setupWithGearOnPanam();

      engine.attackRival(ridingNomad);

      expect(engine.getCard(panam, "legendArea", P1).meta.spent).toBe(true);
    });

    it("gear moves from Panam to the attacking unit after resolving the choice", () => {
      const engine = setupWithGearOnPanam();

      engine.attackRival(ridingNomad);
      engine.resolveCardToMove(gorillaArms);

      const ridingNomadCard = engine.getCard(ridingNomad);
      const gorillaArmsCard = engine.getCard(gorillaArms);

      expect(ridingNomadCard.meta.attachedGearIds).toContain(gorillaArmsCard.instanceId);
      expect(gorillaArmsCard.meta.attachedToId).toBe(ridingNomadCard.instanceId);
    });

    it("Gorilla Arms is no longer attached to Panam after resolving", () => {
      const engine = setupWithGearOnPanam();

      engine.attackRival(ridingNomad);
      engine.resolveCardToMove(gorillaArms);

      expect(engine.getCard(panam, "legendArea", P1).meta.attachedGearIds).toHaveLength(0);
    });

    it("attacking unit is readied after equipping the gear", () => {
      const engine = setupWithGearOnPanam();

      engine.attackRival(ridingNomad);

      // Unit is spent from the attack declaration
      expect(engine.getCard(ridingNomad).meta.spent).toBe(true);

      engine.resolveCardToMove(gorillaArms);

      // Unit is readied by the ifYouDo effect
      expect(engine.getCard(ridingNomad).meta.spent).toBe(false);
    });

    it("declining the choice does not ready the attacking unit", () => {
      const engine = setupWithGearOnPanam();

      engine.attackRival(ridingNomad);
      engine.resolveCardToMove(undefined, { pass: true });

      expect(engine.getCard(ridingNomad).meta.spent).toBe(true);
    });

    it("ability does not trigger when Panam is already spent", () => {
      const engine = setupWithGearOnPanam();

      engine.judgeSpendCard(panam, { as: P1 });

      engine.attackRival(ridingNomad);

      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice?.type).not.toBe("chooseCardToMove");
    });

    it("ability does not trigger when no gear is attached to Panam", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: panam, faceDown: false }],
        field: [{ card: ridingNomad, spent: false }],
      });

      engine.attackRival(ridingNomad);

      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice?.type).not.toBe("chooseCardToMove");
      // Panam should NOT have been spent (ability skipped)
      expect(engine.getCard(panam, "legendArea", P1).meta.spent).toBe(false);
    });

    it("ability does not trigger when a rival unit attacks (player: friendly only)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          legendArea: [{ card: panam, faceDown: false }],
          field: [{ card: ridingNomad, spent: false }],
          hand: [gorillaArms],
          eddies: 4,
        },
        {
          field: [{ card: lowlife, spent: false }],
        },
      );
      engine.attachGear(gorillaArms, panam);

      // End P1's turn so P2 can attack
      engine.completeTurn();

      engine.attackRival(lowlife, { as: P2 });

      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice?.type).not.toBe("chooseCardToMove");
      expect(engine.getCard(panam, "legendArea", P1).meta.spent).toBe(false);
    });
  });
});
