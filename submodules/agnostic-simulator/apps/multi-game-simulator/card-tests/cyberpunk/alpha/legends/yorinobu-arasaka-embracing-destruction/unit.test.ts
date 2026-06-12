import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectCallableLegend,
  expectPendingChoice,
  expectTargetChoice,
} from "@cyberpunk-engine/testing/index.ts";
import {
  alphaYorinobuArasakaEmbracingDestruction,
  alphaSwordwiseHuscle,
  alphaDelamainCab,
  alphaRuthlessLowlife,
} from "@tcg/cyberpunk-cards";
import { defOf } from "@cyberpunk-engine/state/lookups.ts";

const yorinobu = alphaYorinobuArasakaEmbracingDestruction;
const huscle = alphaSwordwiseHuscle;
const delamain = alphaDelamainCab;
const lowlife = alphaRuthlessLowlife;

describe("Yorinobu Arasaka - Embracing Destruction", () => {
  describe("UI prompt", () => {
    it("shows the legend as callable when face-down", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: yorinobu, faceDown: true }],
        eddies: 2,
      });
      expectCallableLegend(engine, yorinobu);
    });

    it("presents a discardFromHand choice after an Arasaka unit attacks", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: yorinobu, faceDown: false }],
        field: [{ card: huscle, spent: false }],
        hand: [delamain],
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      });
      engine.attackRival(huscle);

      const choice = expectPendingChoice(engine, "chooseTarget");
      expectTargetChoice(engine, { type: "discardFromHand", amount: 1 });
      expect((choice.payload as any).amount).toBe(1);
    });
  });

  describe(`The first time a friendly Arasaka unit attacks each turn, draw a card. Then, if you have less than 20 * (Street Cred), discard 1 card from your hand to your trash.`, () => {
    it("draws a card when a friendly Arasaka unit attacks and Yorinobu is face-up", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: yorinobu, faceDown: false }],
        field: [{ card: huscle, spent: false }],
        hand: [delamain, delamain],
        gigArea: [{ dieType: "d6", faceValue: 1 }],
      });

      const handBefore = engine.getHandCount(P1);
      engine.attackRival(huscle);

      // Draw fires: hand count should increase by 1.
      // (Then discard pending choice is created because streetCred = 1 < 20 and hand > 1.)
      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice).toBeDefined();
      expect(choice!.type).toBe("chooseTarget");
      // Net hand count: +1 from draw, discard hasn't resolved yet.
      expect(engine.getHandCount(P1)).toBe(handBefore + 1);
    });

    it("creates a discardFromHand pending choice when streetCred < 20", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: yorinobu, faceDown: false }],
        field: [{ card: huscle, spent: false }],
        hand: [delamain, delamain],
        gigArea: [{ dieType: "d6", faceValue: 5 }],
      });

      engine.attackRival(huscle);

      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice).toBeDefined();
      expect(choice!.type).toBe("chooseTarget");
      expect((choice as any).payload.type).toBe("discardFromHand");
      expect((choice as any).payload.amount).toBe(1);
    });

    it("resolves the discard pending choice by moving the selected card to trash", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: yorinobu, faceDown: false }],
        field: [{ card: huscle, spent: false }],
        hand: [delamain],
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      });

      const handBefore = engine.getHandCount(P1);
      engine.attackRival(huscle);

      // Pending choice created. Resolve by discarding Delamain.
      engine.resolveDiscardFromHand([delamain]);

      // Net: +1 draw, -1 discard = same hand count.
      expect(engine.getHandCount(P1)).toBe(handBefore);
      // Delamain should be in trash.
      const trashCards = engine.getCardsInZone("trash", P1);
      expect(trashCards.some((c) => defOf(c).id === delamain.id)).toBe(true);
    });

    it("does not discard when streetCred >= 20", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: yorinobu, faceDown: false }],
        field: [{ card: huscle, spent: false }],
        gigArea: [
          { dieType: "d6", faceValue: 6 },
          { dieType: "d8", faceValue: 8 },
          { dieType: "d10", faceValue: 6 },
        ],
      });

      const handBefore = engine.getHandCount(P1);
      engine.attackRival(huscle);

      // streetCred = 6 + 8 + 6 = 20, condition is "less than 20" → discard skipped.
      const choice = engine.getState().G.turnMetadata.pendingChoice;
      // No pending choice for discard; only draw fired.
      expect(choice).toBeUndefined();
      expect(engine.getHandCount(P1)).toBe(handBefore + 1);
    });

    it("does not discard when streetCred > 20", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: yorinobu, faceDown: false }],
        field: [{ card: huscle, spent: false }],
        gigArea: [
          { dieType: "d6", faceValue: 6 },
          { dieType: "d8", faceValue: 8 },
          { dieType: "d10", faceValue: 10 },
        ],
      });

      const handBefore = engine.getHandCount(P1);
      engine.attackRival(huscle);

      // streetCred = 24 > 20, condition "less than 20" → discard skipped.
      expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
      expect(engine.getHandCount(P1)).toBe(handBefore + 1);
    });

    it("does not trigger when a non-Arasaka unit attacks", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: yorinobu, faceDown: false }],
        field: [{ card: delamain, spent: false }],
        gigArea: [{ dieType: "d6", faceValue: 1 }],
      });

      const handBefore = engine.getHandCount(P1);
      engine.attackRival(delamain);

      // Delamain is not Arasaka, so Yorinobu should not trigger.
      expect(engine.getHandCount(P1)).toBe(handBefore);
      expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    });

    it("does not trigger when Yorinobu is face-down", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [yorinobu],
        field: [{ card: huscle, spent: false }],
        gigArea: [{ dieType: "d6", faceValue: 1 }],
      });

      const handBefore = engine.getHandCount(P1);
      engine.attackRival(huscle);

      // Yorinobu is face-down → triggered ability inactive.
      expect(engine.getHandCount(P1)).toBe(handBefore);
    });

    it("triggers only once per turn (firstTimeEachTurn)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          legendArea: [{ card: yorinobu, faceDown: false }],
          field: [
            { card: huscle, spent: false },
            { card: lowlife, spent: false },
          ],
          gigArea: [
            { dieType: "d6", faceValue: 6 },
            { dieType: "d8", faceValue: 8 },
            { dieType: "d10", faceValue: 10 },
          ],
        },
        {
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
      );

      // First Arasaka attack: triggers draw (streetCred = 24 >= 20, no discard).
      const handBefore = engine.getHandCount(P1);
      engine.attackRival(huscle);
      expect(engine.getHandCount(P1)).toBe(handBefore + 1);

      // Resolve the first attack fully before declaring the second.
      engine.resolveAttack(); // offensive -> defensive
      engine.resolveAttack({ as: P2, pass: true }); // defensive -> steal
      engine.resolveAttack(); // steal: steal

      // Second Arasaka attack same turn: should NOT trigger again.
      const handAfterFirst = engine.getHandCount(P1);
      engine.attackRival(lowlife);
      expect(engine.getHandCount(P1)).toBe(handAfterFirst);
    });

    it("triggers again on a new turn", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          legendArea: [{ card: yorinobu, faceDown: false }],
          field: [{ card: huscle, spent: false }],
          gigArea: [
            { dieType: "d6", faceValue: 6 },
            { dieType: "d8", faceValue: 8 },
            { dieType: "d10", faceValue: 10 },
          ],
        },
        {
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
      );

      // Turn 1: trigger fires (streetCred = 24, no discard).
      const handT1 = engine.getHandCount(P1);
      engine.attackRival(huscle);
      expect(engine.getHandCount(P1)).toBe(handT1 + 1);

      // Resolve attack and end turn.
      engine.resolveAttack(); // offensive -> defensive
      engine.resolveAttack({ as: P2, pass: true }); // defensive -> steal
      engine.resolveAttack(); // steal: steal
      engine.passPhase(); // end P1 main phase

      // P2 turn: pass both phases.
      engine.completeTurn({ as: P2 });

      // Turn 2: Huscle is readied. Attack again — ability should fire.
      const handT2 = engine.getHandCount(P1);
      engine.attackRival(huscle);
      expect(engine.getHandCount(P1)).toBe(handT2 + 1);
    });

    it("does not trigger when a rival's Arasaka unit attacks", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          legendArea: [{ card: yorinobu, faceDown: false }],
          gigArea: [{ dieType: "d6", faceValue: 1 }],
        },
        {
          field: [{ card: huscle, spent: false }],
        },
      );

      // P1 ends turn.
      engine.completeTurn();

      // P2 attacks — but Yorinobu belongs to P1,
      // so the trigger requires "friendly" and should NOT fire for P2's attack.
      const handBefore = engine.getHandCount(P1);
      engine.attackRival(huscle, { as: P2 });

      expect(engine.getHandCount(P1)).toBe(handBefore);
    });

    it("triggers after calling Yorinobu face-up", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [yorinobu],
        field: [{ card: huscle, spent: false }],
        eddies: 2,
        gigArea: [
          { dieType: "d6", faceValue: 6 },
          { dieType: "d8", faceValue: 8 },
          { dieType: "d10", faceValue: 10 },
        ],
      });

      // Call Yorinobu (flips face-up, costs 2 eddies).
      engine.callLegend(yorinobu);

      const handBefore = engine.getHandCount(P1);
      engine.attackRival(huscle);

      // Now face-up, ability should trigger.
      expect(engine.getHandCount(P1)).toBe(handBefore + 1);
    });

    it("auto-discards when hand has exactly 1 card after draw", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: yorinobu, faceDown: false }],
        field: [{ card: huscle, spent: false }],
        gigArea: [{ dieType: "d6", faceValue: 1 }],
      });

      // Empty the hand so that after the draw, hand has exactly 1 card.
      for (const card of engine.getCardsInZone("hand", P1)) {
        engine.judgeMoveCardToZone(card, "trash", { playerId: P1, as: P1 });
      }

      expect(engine.getHandCount(P1)).toBe(0);

      engine.attackRival(huscle);

      // Drew 1 card (hand = 1), auto-discard fires (hand = 0). No pending choice.
      expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
      expect(engine.getHandCount(P1)).toBe(0);
    });

    it("rejects resolveDiscardFromHand with a card not in hand", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: yorinobu, faceDown: false }],
        field: [{ card: huscle, spent: false }],
        hand: [delamain],
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      });

      engine.attackRival(huscle);

      // Try to discard Huscle (on field, not in hand) by passing its instance ID directly.
      const huscleId = engine.getCard(huscle, "field", P1).instanceId as string;
      const result = engine.executeMove("resolveDiscardFromHand", {
        args: { cardIds: [huscleId] },
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errorCode).toBe("INVALID_CHOICE");
      }
    });
  });
});
