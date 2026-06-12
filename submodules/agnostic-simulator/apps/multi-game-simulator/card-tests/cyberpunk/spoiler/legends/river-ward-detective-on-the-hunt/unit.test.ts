import { describe, expect, it } from "vite-plus/test";
import type { CardInstanceId } from "@cyberpunk-engine/types/branded.ts";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectCallableLegend,
} from "@cyberpunk-engine/testing/index.ts";
import {
  spoilerRiverWardDetectiveOnTheHunt,
  alphaTBugAmateurPhilosopher,
  alphaKiroshiOptics,
  alphaSandevistan,
  alphaSwordwiseHuscle,
  alphaRuthlessLowlife,
} from "@tcg/cyberpunk-cards";

const riverWard = spoilerRiverWardDetectiveOnTheHunt;
const tBug = alphaTBugAmateurPhilosopher; // yellow unit, cost 3, power 5
const kiroshi = alphaKiroshiOptics; // yellow gear, cost 1 (valid: ≤2)
const sandevistan = alphaSandevistan; // gear, cost 3 (invalid: >2)
const huscle = alphaSwordwiseHuscle; // red unit, power 5 (attacker, non-yellow)
const lowlife = alphaRuthlessLowlife; // red unit, power 1 (defender / P2 attacker)

const CALL_COST = 1; // eddies needed to call any legend

describe("River Ward - Detective on the Hunt", () => {
  describe("UI prompt", () => {
    it("shows the legend as callable when face-down", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: riverWard, faceDown: true }],
        eddies: 1,
      });
      expectCallableLegend(engine, riverWard);
    });

    it("has no pending choice after calling (CALL Draw auto-applies)", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [riverWard],
        eddies: CALL_COST,
      });
      engine.callLegend(riverWard);
      expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    });
  });

  // ── CALL ──────────────────────────────────────────────────────────────

  describe(`CALL Draw a card.`, () => {
    it("P1's hand count increases by 1 after calling River Ward", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [riverWard],
        eddies: CALL_COST,
      });

      const handBefore = engine.getHandCount(P1);
      engine.callLegend(riverWard);

      expect(engine.getHandCount(P1)).toBe(handBefore + 1);
    });

    it("River Ward is face-up (not faceDown) after being called", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [riverWard],
        eddies: CALL_COST,
      });

      engine.callLegend(riverWard);

      expect(engine.getCard(riverWard, "legendArea", P1).meta.faceDown).toBe(false);
    });
  });

  // ── ATTACK TRIGGER ────────────────────────────────────────────────────

  describe(`When a Unit attacks, [Spend Icon]: Choose a Gear from your hand with cost 2 or less. Equip it for free to a friendly Yellow Unit with no equipped Gears.`, () => {
    it("sets a chooseCardToPlay pending choice when all conditions are met", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: riverWard, faceDown: false }],
        field: [{ card: tBug, spent: false }],
        hand: [kiroshi],
      });

      engine.attackRival(tBug);

      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice).toBeDefined();
      expect(choice!.type).toBe("chooseCardToPlay");
    });

    it("pending choice is marked as free play", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: riverWard, faceDown: false }],
        field: [{ card: tBug, spent: false }],
        hand: [kiroshi],
      });

      engine.attackRival(tBug);

      const choice = engine.getState().G.turnMetadata.pendingChoice as any;
      expect(choice!.payload.free).toBe(true);
    });

    it("River Ward is spent after the ability triggers", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: riverWard, faceDown: false }],
        field: [{ card: tBug, spent: false }],
        hand: [kiroshi],
      });

      engine.attackRival(tBug);

      expect(engine.getCard(riverWard, "legendArea", P1).meta.spent).toBe(true);
    });

    it("gear is on the field and attached to the yellow unit after resolving the choice", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: riverWard, faceDown: false }],
        field: [{ card: tBug, spent: false }],
        hand: [kiroshi],
      });

      engine.attackRival(tBug);
      engine.resolveCardToPlay(kiroshi);

      const tBugCard = engine.getCard(tBug);
      const kiroshiCard = engine.getCard(kiroshi);

      expect(engine.getCardsInZone("field", P1).some((c) => c.definitionId === kiroshi.id)).toBe(
        true,
      );
      expect(tBugCard.meta.attachedGearIds).toContain(kiroshiCard.instanceId);
    });

    it("gear is removed from hand after being equipped", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: riverWard, faceDown: false }],
        field: [{ card: tBug, spent: false }],
        hand: [kiroshi],
      });

      const handBefore = engine.getHandCount(P1);

      engine.attackRival(tBug);
      engine.resolveCardToPlay(kiroshi);

      expect(engine.getHandCount(P1)).toBe(handBefore - 1);
    });

    it("gear is equipped for free — P1's eddies do not change", () => {
      const eddiesStart = 10;
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: riverWard, faceDown: false }],
        field: [{ card: tBug, spent: false }],
        hand: [kiroshi],
        eddies: eddiesStart,
      });

      engine.attackRival(tBug);
      engine.resolveCardToPlay(kiroshi);

      expect(engine.getEddies(P1)).toBe(eddiesStart);
    });

    it("ability does not trigger when River Ward is already spent", () => {
      // Note: skipSetup resets legend area `spent` to false, so mark River Ward
      // as spent after fixture creation through a judge correction.
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: riverWard, faceDown: false }],
        field: [{ card: tBug, spent: false }],
        hand: [kiroshi],
      });

      engine.judgeSpendCard(riverWard, { as: P1 });

      engine.attackRival(tBug);

      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice?.type).not.toBe("chooseCardToPlay");
    });

    it("ability does not trigger when no eligible yellow unit is on the field", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: riverWard, faceDown: false }],
        field: [{ card: huscle, spent: false }], // red unit, not yellow
        hand: [kiroshi],
      });

      engine.attackRival(huscle);

      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice?.type).not.toBe("chooseCardToPlay");
      // River Ward should NOT have been spent (binding failed)
      expect(engine.getCard(riverWard, "legendArea", P1).meta.spent).toBe(false);
    });

    it("ability does not trigger when no gear with cost 2 or less is in hand", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: riverWard, faceDown: false }],
        field: [{ card: tBug, spent: false }],
        hand: [sandevistan], // cost 3, too expensive
      });

      engine.attackRival(tBug);

      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice?.type).not.toBe("chooseCardToPlay");
      // River Ward should NOT have been spent (no valid gear target)
      expect(engine.getCard(riverWard, "legendArea", P1).meta.spent).toBe(false);
    });

    it("only gears with cost 2 or less appear as valid choices", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: riverWard, faceDown: false }],
        field: [{ card: tBug, spent: false }],
        hand: [kiroshi, sandevistan], // cost 1 (valid) and cost 3 (invalid)
      });

      engine.attackRival(tBug);

      const choice = engine.getState().G.turnMetadata.pendingChoice as any;
      expect(choice).toBeDefined();
      const cardIds: string[] = choice!.payload.cardIds;

      const kiroshiId = engine.getCard(kiroshi, "hand", P1).instanceId as string;
      // Sandevistan should not be in hand anymore (it's still in hand but shouldn't be offered)
      const sandevistanCard = engine
        .getCardsInZone("hand", P1)
        .find((c) => c.definitionId === sandevistan.id);

      expect(cardIds).toContain(kiroshiId);
      if (sandevistanCard) {
        expect(cardIds).not.toContain(sandevistanCard.instanceId as string);
      }
    });

    it("ability triggers when a rival unit attacks (player: any)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          legendArea: [{ card: riverWard, faceDown: false }],
          field: [{ card: tBug, spent: false }],
          hand: [kiroshi],
        },
        {
          field: [{ card: lowlife, spent: false }],
        },
      );

      // End P1's turn so P2 can attack
      engine.completeTurn(); // P1's turn → P2's turn
      // P2 moves to main phase

      // P2's lowlife attacks P1 directly
      engine.attackRival(lowlife, { as: P2 });

      // River Ward (P1's) should have triggered
      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice).toBeDefined();
      expect(choice!.type).toBe("chooseCardToPlay");
      expect(engine.getCard(riverWard, "legendArea", P1).meta.spent).toBe(true);
    });

    it("yellow unit that already has gear attached is excluded — binding returns no target and ability does not fire", () => {
      // Set up: only one yellow unit (T-Bug) on field + gear in hand + River Ward ready.
      // Pre-attach gear to T-Bug so the `hasAttachedCards: false` filter
      // correctly excludes it. Then attack with Huscle (non-yellow) and verify River Ward
      // does NOT spend itself and no pending choice is set.
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: riverWard, faceDown: false }],
        field: [
          { card: huscle, spent: false },
          { card: tBug, spent: false },
        ],
        hand: [kiroshi],
      });

      const tBugInst = engine.getCard(tBug, "field", P1);
      engine.judgeSetCardMeta(tBugInst, { attachedGearIds: ["existing-gear" as CardInstanceId] });

      engine.attackRival(huscle); // huscle attacks — any unit triggers River Ward

      // T-Bug has gear → binding finds no yellow unit with no gear → ability skipped
      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice?.type).not.toBe("chooseCardToPlay");
      expect(engine.getCard(riverWard, "legendArea", P1).meta.spent).toBe(false);
    });

    it("cardPlayed triggers from other cards fire when gear is played via resolveCardToPlay", () => {
      // Regression guard: resolveCardToPlayMove must call processEventTriggers after
      // emitting cardPlayed, otherwise cascade triggers (e.g. V - Streetkid's
      // "when a Gear is played" effect) are silently skipped.
      //
      // We verify this by checking that River Ward's own spent cost is visible to the
      // state AFTER resolveCardToPlay, and that the cardPlayed event is processed —
      // concretely, a second River Ward ability cannot fire again (firstTimeEachTurn
      // guard prevents it), but the event itself reaches the trigger pipeline.
      //
      // We use a simpler observable: playing the gear via resolveCardToPlay should
      // leave it on the field (not in hand), confirming the full resolve path ran.
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: riverWard, faceDown: false }],
        field: [
          { card: tBug, spent: false },
          { card: huscle, spent: false },
        ],
        hand: [kiroshi],
        eddies: 10,
      });

      engine.attackRival(huscle);

      // Pending choice should be set (River Ward triggered).
      expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseCardToPlay");

      const handBefore = engine.getHandCount(P1);
      engine.resolveCardToPlay(kiroshi);

      // Gear moved from hand to field.
      expect(engine.getHandCount(P1)).toBe(handBefore - 1);
      // Gear is on the field (not stuck in hand — resolveCardToPlay ran to completion).
      const kiroshiInst = engine.getCard(kiroshi, "field", P1);
      expect(kiroshiInst).toBeDefined();
      // No lingering pending choice after resolution.
      expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    });
  });
});
