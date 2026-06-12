import { describe, it, expect } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectAttackCandidate,
  expectNotAttackCandidate,
} from "@cyberpunk-engine/testing/index.ts";
import { spoilerKerryEurodyneTheLastRockerboy } from "@tcg/cyberpunk-cards";
import {
  enMessages,
  formatActionLog,
  stripPrivateFields,
} from "@cyberpunk-engine/logging/index.ts";

const kerry = spoilerKerryEurodyneTheLastRockerboy;

describe("Kerry Eurodyne - The Last Rockerboy", () => {
  describe("UI prompt", () => {
    it("shows the unit as an attack candidate when ready", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: kerry, spent: false }],
      });
      expectAttackCandidate(engine, kerry);
    });

    it("does NOT show a spent unit as an attack candidate", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: kerry, spent: true }],
      });
      expectNotAttackCandidate(engine, kerry);
    });
  });

  describe("[Spend Icon]: If you have a Gig at max value, draw 2 cards.", () => {
    it("draws 2 cards when activated with a gig at max value (d6 at 6)", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: kerry, spent: false }],
        gigArea: [{ dieType: "d6", faceValue: 6 }],
        deck: 20,
      });

      const handBefore = engine.getHandCount(P1);

      const result = engine.activateAbility(kerry, 0);

      expect(engine.getHandCount(P1)).toBe(handBefore + 2);

      const drawLog = result.moveLogs.find(
        (log) => log.type === "action" && log.messageKey === "effect.draw.resolved",
      );
      expect(drawLog).toBeDefined();
      if (!drawLog || drawLog.type !== "action") return;

      const ownerLog = stripPrivateFields(drawLog, P1);
      const rivalLog = stripPrivateFields(drawLog, P2);
      expect(ownerLog.params.sourceCardName).toBe(kerry.displayName);
      expect(ownerLog.params.drawnCount).toBe(2);
      expect(ownerLog.params.drawnCardIds).toHaveLength(2);
      expect(rivalLog.params.drawnCount).toBe(2);
      expect(rivalLog.params.drawnCardIds).toBeUndefined();
    });

    it("does not draw when no gig is at max value", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: kerry, spent: false }],
        gigArea: [{ dieType: "d6", faceValue: 3 }],
        deck: 20,
      });

      const handBefore = engine.getHandCount(P1);

      const result = engine.activateAbility(kerry, 0);

      // Ability activates (Kerry gets spent) but condition not met, so no draw
      expect(engine.getHandCount(P1)).toBe(handBefore);

      expect(
        result.moveLogs.some(
          (log) => log.type === "action" && log.messageKey === "effect.draw.resolved",
        ),
      ).toBe(false);

      const skippedLog = result.moveLogs.find(
        (log) => log.type === "action" && log.messageKey === "effect.draw.skipped",
      );
      expect(skippedLog).toBeDefined();
      if (!skippedLog || skippedLog.type !== "action") return;
      expect(skippedLog.params.sourceCardName).toBe(kerry.displayName);
      expect(skippedLog.params.reason).toBe("no friendly Gig is at max value");
    });

    it("fails when Kerry is already spent (CARD_SPENT error)", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: kerry, spent: false }],
        gigArea: [{ dieType: "d6", faceValue: 6 }],
        deck: 20,
      });

      engine.judgeSpendCard(kerry);

      const failure = engine.expectFailure(() => engine.activateAbility(kerry, 0));
      expect(failure.errorCode).toBe("CARD_SPENT");
    });

    it("Kerry becomes spent after activation", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: kerry, spent: false }],
        gigArea: [{ dieType: "d6", faceValue: 6 }],
        deck: 20,
      });

      engine.activateAbility(kerry, 0);

      expect(engine.getCard(kerry).meta.spent).toBe(true);
    });

    it("works with a d4 gig at max value (4)", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: kerry, spent: false }],
        gigArea: [{ dieType: "d4", faceValue: 4 }],
        deck: 20,
      });

      const handBefore = engine.getHandCount(P1);

      engine.activateAbility(kerry, 0);

      expect(engine.getHandCount(P1)).toBe(handBefore + 2);
    });

    it("works when one smaller die is at max and a larger die is below max", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: kerry, spent: false }],
        gigArea: [
          { dieType: "d4", faceValue: 4 },
          { dieType: "d6", faceValue: 2 },
        ],
        deck: 20,
      });

      const handBefore = engine.getHandCount(P1);

      engine.activateAbility(kerry, 0);

      expect(engine.getHandCount(P1)).toBe(handBefore + 2);
    });

    it("works with a d8 gig at max value (8)", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: kerry, spent: false }],
        gigArea: [{ dieType: "d8", faceValue: 8 }],
        deck: 20,
      });

      const handBefore = engine.getHandCount(P1);

      engine.activateAbility(kerry, 0);

      expect(engine.getHandCount(P1)).toBe(handBefore + 2);
    });

    it("does NOT check rival's gigs for max value", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: kerry, spent: false }],
          gigArea: [{ dieType: "d6", faceValue: 3 }],
          deck: 20,
        },
        {
          gigArea: [{ dieType: "d6", faceValue: 6 }],
        },
      );

      const handBefore = engine.getHandCount(P1);

      engine.activateAbility(kerry, 0);

      // Rival has max gig but friendly does not — should not draw
      expect(engine.getHandCount(P1)).toBe(handBefore);
    });

    it("hand count increases by exactly 2", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: kerry, spent: false }],
        gigArea: [{ dieType: "d6", faceValue: 6 }],
        deck: 20,
      });

      const handBefore = engine.getHandCount(P1);

      engine.activateAbility(kerry, 0);

      const handAfter = engine.getHandCount(P1);
      expect(handAfter - handBefore).toBe(2);
    });

    it("emits an action log for the activated ability", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: kerry, spent: false }],
        gigArea: [{ dieType: "d6", faceValue: 6 }],
        deck: 20,
      });

      engine.activateAbility(kerry, 0);

      const logs = engine.getEvents("actionLog");
      const activateLog = logs.find((e: any) => e.messageKey === "move.activateAbility") as any;
      expect(activateLog).toBeDefined();
      expect(activateLog.params.cardName).toBe(kerry.displayName);

      const text = formatActionLog(activateLog, enMessages);
      expect(text).toContain(kerry.displayName);
    });

    it("Kerry is spent even when the condition is not met (no max gig)", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: kerry, spent: false }],
        gigArea: [{ dieType: "d6", faceValue: 2 }],
        deck: 20,
      });

      const handBefore = engine.getHandCount(P1);

      engine.activateAbility(kerry, 0);

      // Kerry should be spent regardless of whether the draw happened
      expect(engine.getCard(kerry).meta.spent).toBe(true);
      // And no cards were drawn
      expect(engine.getHandCount(P1)).toBe(handBefore);
    });
  });
});
