import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  expectCardPlayable,
  expectPendingChoice,
  expectEligibleTargetCount,
  expectTargetChoice,
  expectAdjustGigChoice,
} from "@cyberpunk-engine/testing/index.ts";
import { spoilerAfterpartyAtLizzieS } from "@tcg/cyberpunk-cards";
import { enMessages, formatActionLog } from "@cyberpunk-engine/logging/index.ts";

const program = spoilerAfterpartyAtLizzieS; // cost 2, program
const p1LeadGigs = [
  { dieType: "d4" as const, faceValue: 1 },
  { dieType: "d8" as const, faceValue: 1 },
];

describe("Afterparty at Lizzie's", () => {
  describe("UI prompt", () => {
    it("shows the program as playable", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [program],
        eddies: program.cost,
      });
      expectCardPlayable(engine, program);
    });

    it("presents a rival gig as a target after playing", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [program],
          eddies: program.cost,
          gigArea: p1LeadGigs,
        },
        {
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
      );
      engine.playCard(program);
      expectPendingChoice(engine, "chooseTarget");
      expectTargetChoice(engine, { type: "effectTarget", targetKind: "gig", min: 1, max: 1 });
      expectEligibleTargetCount(engine, 1);
    });

    it("presents an adjustGig choice after selecting the rival gig", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [program],
          eddies: program.cost,
          gigArea: p1LeadGigs,
        },
        {
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
      );
      engine.playCard(program);

      const step1 = expectPendingChoice(engine, "chooseTarget");
      const d6Id = step1.payload.eligibleIds![0];
      engine.executeMove("resolveEffectTarget", { args: { targetIds: [d6Id] } }, P1);

      expectPendingChoice(engine, "chooseTarget");
      expectAdjustGigChoice(engine, { maxAmount: 2, direction: "either" });
    });
  });

  describe(`Adjust a rival Gig by up to ±2. Then, if a friendly Gig has the same value, draw a card.`, () => {
    it("can be played from hand when rival has a gig", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [program],
          eddies: program.cost,
          gigArea: p1LeadGigs,
        },
        { gigArea: [{ dieType: "d6", faceValue: 3 }] },
      );

      // playCard should succeed — the Gig target selection creates a pending choice
      engine.playCard(program);

      // Verify the pending choice was created for choosing which rival Gig to adjust
      const state = engine.getState();
      expect(state.G.turnMetadata.pendingChoice).toBeDefined();
    });

    it("deducts 2 eddies from the player", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [program],
          eddies: 4,
          gigArea: p1LeadGigs,
        },
        { gigArea: [{ dieType: "d6", faceValue: 3 }] },
      );

      engine.playCard(program);

      expect(engine.getEddies(P1)).toBe(2); // 4 - 2
    });

    it("fails when player has insufficient eddies", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [program],
          eddies: 0,
          gigArea: p1LeadGigs,
        },
        { gigArea: [{ dieType: "d6", faceValue: 3 }] },
      );
      engine.spendAllLegends();

      const failure = engine.expectFailure(() => engine.playCard(program));
      expect(failure.errorCode).toBe("INSUFFICIENT_EDDIES");
    });

    it("first asks which rival gig to adjust", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [program],
          eddies: program.cost,
          gigArea: p1LeadGigs,
        },
        { gigArea: [{ dieType: "d6", faceValue: 3 }] },
      );

      engine.playCard(program);

      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice).toBeDefined();
      expect(choice!.type).toBe("chooseTarget");
      expect((choice!.payload as any).type).toBe("effectTarget");
      expect((choice!.payload as any).targetKind).toBe("gig");
      expect((choice!.payload as any).eligibleIds).toHaveLength(1);
    });

    it("targets rival gigs (not friendly)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [program],
          eddies: program.cost,
          gigArea: [
            { dieType: "d8", faceValue: 5 },
            { dieType: "d4", faceValue: 1 },
          ], // friendly gigs
        },
        { gigArea: [{ dieType: "d6", faceValue: 3 }] }, // rival gig
      );

      engine.playCard(program);

      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice).toBeDefined();
      // The pending choice should reference a rival gig die, not a friendly one
      const payload = choice!.payload as any;
      expect(payload.eligibleIds).toBeDefined();
      expect(payload.eligibleIds).toHaveLength(1);
    });

    it("can choose the d12 instead of auto-selecting the first rival gig", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [program],
          eddies: program.cost,
          gigArea: [
            { dieType: "d8", faceValue: 8 },
            { dieType: "d4", faceValue: 1 },
          ],
        },
        {
          gigArea: [
            { dieType: "d6", faceValue: 4 },
            { dieType: "d12", faceValue: 10 },
          ],
        },
      );

      engine.playCard(program);

      const targetChoice = engine.getState().G.turnMetadata.pendingChoice;
      expect(targetChoice?.type).toBe("chooseTarget");
      const eligibleIds = (targetChoice!.payload as any).eligibleIds as string[];
      expect(eligibleIds).toHaveLength(2);
      const d12Id = eligibleIds.find((id) => engine.getState().G.gigDice[id]?.dieType === "d12");
      expect(d12Id).toBeDefined();

      engine.executeMove("resolveEffectTarget", { args: { targetIds: [d12Id!] } }, P1);

      const adjustChoice = engine.getState().G.turnMetadata.pendingChoice;
      expect(adjustChoice?.type).toBe("chooseTarget");
      expect((adjustChoice!.payload as any).type).toBe("adjustGig");
      expect((adjustChoice!.payload as any).dieId).toBe(d12Id);

      engine.executeMove("resolveAdjustGig", { args: { value: 8 } }, P1);

      expect(engine.getState().G.gigDice[d12Id!]!.faceValue).toBe(8);
    });

    it("draws when the adjusted rival gig matches a friendly gig value", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [program],
          eddies: program.cost,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
          deck: 3,
        },
        {
          gigArea: [{ dieType: "d6", faceValue: 4 }],
        },
      );

      const handBefore = engine.getHandCount(P1);

      engine.playCard(program);
      const targetChoice = engine.getState().G.turnMetadata.pendingChoice;
      expect(targetChoice?.type).toBe("chooseTarget");
      const d6Id = (targetChoice!.payload as any).eligibleIds.find(
        (id: string) => engine.getState().G.gigDice[id]?.dieType === "d6",
      );
      expect(d6Id).toBeDefined();

      engine.executeMove("resolveEffectTarget", { args: { targetIds: [d6Id!] } }, P1);
      engine.executeMove("resolveAdjustGig", { args: { value: 2 } }, P1);

      expect(engine.getHandCount(P1)).toBe(handBefore);
      expect(engine.getState().G.gigDice[d6Id!]!.faceValue).toBe(2);
    });

    it("program is no longer in hand after playing", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [program],
          eddies: program.cost,
          gigArea: p1LeadGigs,
        },
        { gigArea: [{ dieType: "d6", faceValue: 3 }] },
      );

      engine.playCard(program);

      const handCards = engine.getCardsInZone("hand", P1);
      expect(handCards.some((c) => c.definitionId === program.id)).toBe(false);
    });

    it("no valid target when rival has no gigs — program resolves with no effect", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [program],
        eddies: program.cost,
      });

      engine.playCard(program);

      // Program should resolve (go to trash) since there are no rival gigs
      const p1Trash = engine.getCardsInZone("trash", P1);
      expect(p1Trash.some((c) => c.definitionId === program.id)).toBe(true);
    });

    it("emits an action log for playing the program", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [program],
          eddies: program.cost,
          gigArea: p1LeadGigs,
        },
        { gigArea: [{ dieType: "d6", faceValue: 3 }] },
      );

      engine.playCard(program);

      const log = engine.getLastActionLog();
      expect(log).toBeDefined();
      expect(log!.messageKey).toBe("move.playCard");
      expect(log!.params.cardName).toBe(program.displayName);

      const text = formatActionLog(log!, enMessages);
      expect(text).toContain(program.displayName);
    });
  });
});
