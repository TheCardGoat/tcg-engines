import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P2,
  expectAttackCandidate,
  expectNotAttackCandidate,
  expectPendingChoice,
  expectEligibleTargetCount,
  expectTargetChoice,
} from "@cyberpunk-engine/testing/index.ts";
import {
  alphaRuthlessLowlife,
  alphaSwordwiseHuscle,
  spoilerSandayuOdaHanakoSGuardian,
} from "@tcg/cyberpunk-cards";

const sandayu = spoilerSandayuOdaHanakoSGuardian; // unit, cost 7, power 8
const lowlife = alphaRuthlessLowlife; // unit, power 1
const huscle = alphaSwordwiseHuscle; // unit, power 5

describe("Sandayu Oda - Hanako's Guardian", () => {
  describe("UI prompt", () => {
    it("shows the unit as an attack candidate when ready", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: sandayu, spent: false }],
      });
      expectAttackCandidate(engine, sandayu);
    });

    it("does NOT show a spent unit as an attack candidate", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: sandayu, spent: true }],
      });
      expectNotAttackCandidate(engine, sandayu);
    });

    it("presents rival units as targets after playing with a value-pair", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [sandayu],
          eddies: sandayu.cost,
          gigArea: [
            { dieType: "d4", faceValue: 3 },
            { dieType: "d6", faceValue: 3 },
          ],
        },
        {
          field: [
            { card: lowlife, spent: false },
            { card: huscle, spent: false },
          ],
        },
      );
      engine.playCard(sandayu);
      expectPendingChoice(engine, "chooseTarget");
      expectTargetChoice(engine, { type: "effectTarget", targetKind: "card", min: 1, max: 1 });
      expectEligibleTargetCount(engine, 2);
    });
  });

  describe("[PLAY] Spend a rival Unit for each friendly value-pair of Gigs", () => {
    it("spends nothing when the friendly Gig dice have no value-pair", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [sandayu],
          eddies: sandayu.cost,
          gigArea: [
            { dieType: "d4", faceValue: 3 },
            { dieType: "d6", faceValue: 5 },
            { dieType: "d8", faceValue: 7 },
          ],
        },
        { field: [{ card: huscle, spent: false }] },
      );

      engine.playCard(sandayu);

      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice).toBeFalsy();

      const p2Field = engine.getCardsInZone("field", P2);
      const rival = p2Field.find((c) => c.definitionId === huscle.id);
      expect(rival).toBeDefined();
      expect(rival!.meta.spent).toBe(false);
    });

    it("spends one rival Unit when the friendly Gig dice have a single value-pair", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [sandayu],
          eddies: sandayu.cost,
          gigArea: [
            { dieType: "d4", faceValue: 3 },
            { dieType: "d6", faceValue: 3 },
            { dieType: "d8", faceValue: 7 },
          ],
        },
        { field: [{ card: huscle, spent: false }] },
      );

      engine.playCard(sandayu);
      engine.resolveEffectTarget(huscle);

      const p2Field = engine.getCardsInZone("field", P2);
      const rival = p2Field.find((c) => c.definitionId === huscle.id);
      expect(rival).toBeDefined();
      expect(rival!.meta.spent).toBe(true);

      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice).toBeFalsy();
    });

    it("requires one rival Unit target per available friendly value-pair", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [sandayu],
          eddies: sandayu.cost,
          gigArea: [
            { dieType: "d4", faceValue: 3 },
            { dieType: "d6", faceValue: 3 },
            { dieType: "d8", faceValue: 7 },
            { dieType: "d10", faceValue: 7 },
          ],
        },
        {
          field: [
            { card: lowlife, spent: false },
            { card: huscle, spent: false },
          ],
        },
      );

      engine.playCard(sandayu);
      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice?.type).toBe("chooseTarget");
      if (choice?.type !== "chooseTarget" || choice.payload.type !== "effectTarget") {
        throw new Error("Expected Sandayu Oda to prompt for rival Unit targets");
      }
      expect(choice.payload.min).toBe(2);
      expect(choice.payload.max).toBe(2);

      engine.resolveEffectTarget([lowlife, huscle]);

      const lowlifeAfter = engine
        .getCardsInZone("field", P2)
        .find((c) => c.definitionId === lowlife.id);
      const huscleAfter = engine
        .getCardsInZone("field", P2)
        .find((c) => c.definitionId === huscle.id);
      expect(lowlifeAfter?.meta.spent).toBe(true);
      expect(huscleAfter?.meta.spent).toBe(true);
      expect(engine.getState().G.turnMetadata.pendingChoice).toBeFalsy();
    });
  });

  describe("[Static] Can attack rival Units the turn it's played", () => {
    it("can attack a spent rival Unit on the turn played", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [sandayu],
          eddies: sandayu.cost,
          // No value-pair → PLAY does nothing, so no pending choice clutters the test.
          gigArea: [
            { dieType: "d4", faceValue: 2 },
            { dieType: "d6", faceValue: 5 },
            { dieType: "d8", faceValue: 7 },
          ],
        },
        { field: [{ card: lowlife, spent: true }] },
      );

      engine.playCard(sandayu);

      engine.attackUnit(sandayu, lowlife);

      const attack = engine.getAttackState();
      expect(attack).not.toBeNull();
      expect(attack!.kind).toBe("fight");
    });

    it("CANNOT attack the rival directly on the turn played (no GO SOLO)", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [sandayu],
        eddies: sandayu.cost,
        gigArea: [
          { dieType: "d4", faceValue: 2 },
          { dieType: "d6", faceValue: 5 },
          { dieType: "d8", faceValue: 7 },
        ],
      });

      engine.playCard(sandayu);

      const failure = engine.expectFailure(() => engine.attackRival(sandayu));
      expect(failure.errorCode).toBe("SUMMONING_SICKNESS");
    });
  });

  describe("printed stats", () => {
    it("has the printed base power, cost, and classifications", () => {
      expect(sandayu.cost).toBe(7);
      expect(sandayu.power).toBe(8);
      expect(sandayu.color).toBe("green");
      expect(sandayu.classifications).toContain("Ganger");
      expect(sandayu.classifications).toContain("Valentino");
    });
  });
});
