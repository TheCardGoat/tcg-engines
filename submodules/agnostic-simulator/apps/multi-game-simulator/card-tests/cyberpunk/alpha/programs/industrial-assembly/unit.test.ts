import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  expectCardPlayable,
  expectPendingChoice,
  expectEligibleTargetCount,
  expectTargetChoice,
  expectEligibleGigs,
} from "@cyberpunk-engine/testing/index.ts";
import { alphaIndustrialAssembly } from "@tcg/cyberpunk-cards";
import { enMessages, formatActionLog } from "@cyberpunk-engine/logging/index.ts";

const program = alphaIndustrialAssembly; // cost 2, program

function industrialAssemblyChoice(engine: CyberpunkTestEngine) {
  const choice = engine.getState().G.turnMetadata.pendingChoice;
  expect(choice?.type).toBe("chooseTarget");
  if (!choice || choice.type !== "chooseTarget" || choice.payload.type !== "effectTarget") {
    throw new Error("Expected Industrial Assembly target choice");
  }
  expect(choice.payload.targetKind).toBe("gig");
  expect(choice.payload.min).toBe(1);
  expect(choice.payload.max).toBe(1);
  return choice;
}

describe("Industrial Assembly", () => {
  describe("UI prompt", () => {
    it("shows the program as playable", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [program],
        eddies: program.cost,
      });
      expectCardPlayable(engine, program);
    });

    it("presents friendly gigs as targets after playing", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [program],
        eddies: program.cost,
        gigArea: [
          { dieType: "d6", faceValue: 1 },
          { dieType: "d8", faceValue: 2 },
        ],
      });
      engine.playCard(program);
      expectPendingChoice(engine, "chooseTarget");
      expectTargetChoice(engine, { type: "effectTarget", targetKind: "gig", min: 1, max: 1 });
      expectEligibleTargetCount(engine, 2);
      expectEligibleGigs(engine, [{ dieType: "d6" }, { dieType: "d8" }]);
    });
  });

  describe(`Increase a friendly gig by 4. Then, if you have 7+ * (Street Cred), draw a card.`, () => {
    it("asks the player to choose exactly one friendly gig", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [program],
        eddies: program.cost,
        gigArea: [
          { dieType: "d6", faceValue: 1 },
          { dieType: "d8", faceValue: 2 },
        ],
      });

      engine.playCard(program);

      const choice = industrialAssemblyChoice(engine);
      expect((choice.payload.eligibleIds ?? []).sort()).toEqual(
        [engine.findGigIdByType(P1, "d6"), engine.findGigIdByType(P1, "d8")].sort(),
      );
    });

    it("increases the chosen friendly gig die value by 4", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [program],
        eddies: program.cost,
        gigArea: [{ dieType: "d6", faceValue: 1 }],
      });

      engine.playCard(program);
      engine.resolve(program, { friendlyGig: "d6" });

      expect(engine.getGigValue(P1)).toBe(5); // 1 + 4 = 5
    });

    it("does not increase unchosen friendly gigs", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [program],
        eddies: program.cost,
        gigArea: [
          { dieType: "d6", faceValue: 1 },
          { dieType: "d8", faceValue: 2 },
        ],
      });

      engine.playCard(program, { friendlyGig: "d6" });

      expect(engine.getGigValue(P1, 0)).toBe(5); // d6: 1 + 4
      expect(engine.getGigValue(P1, 1)).toBe(2); // d8 unchanged
    });

    it("clamps gig value at die maximum (d6 max is 6)", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [program],
        eddies: program.cost,
        gigArea: [{ dieType: "d6", faceValue: 4 }],
      });

      engine.playCard(program);
      engine.resolve(program, { friendlyGig: "d6" });

      expect(engine.getGigValue(P1)).toBe(6); // 4 + 4 = 8, clamped to 6
    });

    it("clamps gig value at die maximum (d12 max is 12)", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [program],
        eddies: program.cost,
        gigArea: [{ dieType: "d12", faceValue: 10 }],
      });

      engine.playCard(program);
      engine.resolve(program, { friendlyGig: "d12" });

      expect(engine.getGigValue(P1)).toBe(12); // 10 + 4 = 14, clamped to 12
    });

    it("increases only one friendly gig when multiple are present", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [program],
        eddies: program.cost,
        gigArea: [
          { dieType: "d6", faceValue: 1 },
          { dieType: "d8", faceValue: 2 },
        ],
      });

      engine.playCard(program);
      engine.resolve(program, { friendlyGig: "d6" });

      const dice = engine.getGigDice(P1);
      expect(dice[0]!.faceValue).toBe(5);
      expect(dice[1]!.faceValue).toBe(2);
    });

    it("draws a card when street cred >= 7 after the increase", () => {
      // Start with gig faceValue 3 (street cred = 3). After +4 → 7 (street cred = 7).
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [program],
        eddies: program.cost,
        gigArea: [{ dieType: "d8", faceValue: 3 }],
        deck: 20,
      });

      const handBefore = engine.getHandCount(P1);

      engine.playCard(program);
      engine.resolve(program, { friendlyGig: "d8" });

      // -1 program played, +1 drawn = net 0 hand change
      expect(engine.getHandCount(P1)).toBe(handBefore);
      expect(engine.getGigValue(P1)).toBe(7);
    });

    it("does NOT draw a card when street cred < 7 after the increase", () => {
      // Start with gig faceValue 2 (street cred = 2). After +4 → 6 (street cred = 6).
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [program],
        eddies: program.cost,
        gigArea: [{ dieType: "d8", faceValue: 2 }],
        deck: 20,
      });

      const handBefore = engine.getHandCount(P1);

      engine.playCard(program);
      engine.resolve(program, { friendlyGig: "d8" });

      // -1 program played, no draw = net -1 hand
      expect(engine.getHandCount(P1)).toBe(handBefore - 1);
      expect(engine.getGigValue(P1)).toBe(6);
    });

    it("program goes to trash after resolving", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [program],
        eddies: program.cost,
        gigArea: [{ dieType: "d6", faceValue: 1 }],
      });

      engine.playCard(program);
      engine.resolve(program, { friendlyGig: "d6" });

      const p1Trash = engine.getCardsInZone("trash", P1);
      expect(p1Trash.some((c) => c.definitionId === program.id)).toBe(true);
    });

    it("deducts 2 eddies from the player", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [program],
        eddies: 4,
        gigArea: [{ dieType: "d6", faceValue: 1 }],
      });

      engine.playCard(program);

      expect(engine.getEddies(P1)).toBe(2); // 4 - 2
    });

    it("fails when player has insufficient eddies", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [program],
        eddies: 1,
        gigArea: [{ dieType: "d6", faceValue: 1 }],
      });
      engine.spendAllLegends();

      const failure = engine.expectFailure(() => engine.playCard(program));
      expect(failure.errorCode).toBe("INSUFFICIENT_EDDIES");
    });

    it("emits an action log for playing the program", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [program],
        eddies: program.cost,
        gigArea: [{ dieType: "d6", faceValue: 1 }],
      });

      engine.playCard(program);

      const log = engine
        .getEvents("actionLog")
        .find((event) => event.type === "actionLog" && event.messageKey === "move.playCard");
      if (!log || log.type !== "actionLog") {
        throw new Error("Expected playCard action log");
      }
      expect(log).toBeDefined();
      expect(log.messageKey).toBe("move.playCard");
      expect(log.params.cardName).toBe(program.displayName);

      const text = formatActionLog(log, enMessages);
      expect(text).toContain(program.displayName);
    });
  });
});
