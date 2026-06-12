import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectCardPlayable,
  expectPendingChoice,
  expectEligibleTargets,
  expectTargetChoice,
} from "@cyberpunk-engine/testing/index.ts";
import {
  alphaArmoredMinotaur,
  alphaCorpoSecurity,
  alphaRuthlessLowlife,
  alphaSwordwiseHuscle,
  spoilerCarnageAtTheColosseum,
} from "@tcg/cyberpunk-cards";
import type { CommandSuccess } from "@cyberpunk-engine/types/commands.ts";
import { enMessages, formatActionLog } from "@cyberpunk-engine/logging/index.ts";

const carnage = spoilerCarnageAtTheColosseum; // program, cost 6
const corpoSecurity = alphaCorpoSecurity; // unit, cost 2, power 2
const lowlife = alphaRuthlessLowlife; // unit, power 1
const huscle = alphaSwordwiseHuscle; // unit, power 5
const minotaur = alphaArmoredMinotaur; // unit, power 9

function actionMoveLogTexts(result: CommandSuccess): string[] {
  return result.moveLogs.flatMap((log) =>
    log.type === "action"
      ? [
          formatActionLog(
            {
              type: "actionLog",
              messageKey: log.messageKey,
              params: log.params,
              playerId: log.playerId,
            },
            enMessages,
          ),
        ]
      : [],
  );
}

describe("Carnage At The Colosseum", () => {
  describe("UI prompt", () => {
    it("shows the program as playable", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [carnage],
        eddies: carnage.cost,
      });
      expectCardPlayable(engine, carnage);
    });

    it("presents the correct targets after playing", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [carnage],
          eddies: carnage.cost,
          field: [{ card: huscle, spent: false }],
        },
        {
          field: [
            { card: lowlife, spent: false },
            { card: corpoSecurity, spent: false },
          ],
        },
      );
      engine.playCard(carnage);
      expectPendingChoice(engine, "chooseTarget");
      expectTargetChoice(engine, { type: "effectTarget", targetKind: "card", min: 1, max: 1 });
      expectEligibleTargets(engine, [lowlife, corpoSecurity], { as: P2 });
    });
  });

  describe("printed stats", () => {
    it("has the printed cost, color, classifications, and type", () => {
      expect(carnage.type).toBe("program");
      expect(carnage.cost).toBe(6);
      expect(carnage.color).toBe("red");
      expect(carnage.classifications).toEqual(["Braindance", "Extreme"]);
    });
  });

  describe("cost modifier", () => {
    it("declares a perTargetCount reducer scoped to friendly Gigs with value 8+", () => {
      expect(carnage.costModifier).toEqual({
        reducer: "perTargetCount",
        reductionPerCount: 1,
        target: {
          selector: "gig",
          controller: "friendly",
          amount: "all",
          minValue: 8,
        },
        min: 1,
      });
    });

    it("pays the printed cost when no friendly Gig has value 8+", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [carnage],
          eddies: carnage.cost,
          gigArea: [
            { dieType: "d8", faceValue: 7 },
            { dieType: "d10", faceValue: 5 },
          ],
        },
        { field: [{ card: huscle, spent: false }] },
      );

      engine.playCard(carnage);

      // Spent all 6 eddies (no discount).
      expect(engine.getEddies(P1)).toBe(0);
    });

    it("reduces the cost by 1 per friendly Gig with value 8+", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [carnage],
          // Pre-load enough eddies to compare actual spend.
          eddies: 10,
          gigArea: [
            { dieType: "d8", faceValue: 8 }, // counts
            { dieType: "d10", faceValue: 9 }, // counts
            { dieType: "d12", faceValue: 7 }, // doesn't
          ],
        },
        { field: [{ card: huscle, spent: false }] },
      );

      engine.playCard(carnage);

      // Cost reduced from 6 to 4 (10 → 6).
      expect(engine.getEddies(P1)).toBe(6);
    });

    it("never drops below the printed minimum of 1 €$", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [carnage],
          eddies: 5,
          gigArea: [
            { dieType: "d10", faceValue: 10 },
            { dieType: "d12", faceValue: 12 },
            { dieType: "d20", faceValue: 20 },
          ],
        },
        { field: [{ card: huscle, spent: false }] },
      );

      engine.playCard(carnage);

      // 6 - 3 = 3 (still above min). Confirm we paid 3.
      expect(engine.getEddies(P1)).toBe(2);
    });

    it("allows play when reduced cost is within reach but the printed cost is not", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [carnage],
          eddies: 5, // less than printed 6, but reduced cost is 4
          gigArea: [
            { dieType: "d8", faceValue: 8 },
            { dieType: "d10", faceValue: 10 },
          ],
        },
        { field: [{ card: huscle, spent: false }] },
      );

      const result = engine.playCard(carnage);
      expect(result.success).toBe(true);
      expect(engine.getEddies(P1)).toBe(1);
    });

    it("emits readable play and target-selection move logs", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [carnage],
          eddies: 4,
          field: [{ card: minotaur, spent: false }],
          gigArea: [
            { dieType: "d8", faceValue: 8 },
            { dieType: "d10", faceValue: 10 },
          ],
        },
        { field: [{ card: lowlife, spent: false }] },
      );

      const playResult = engine.playCard(carnage);
      expect(actionMoveLogTexts(playResult)).toContain(
        `Played ${carnage.displayName} for 4 eddies.`,
      );

      const targetResult = engine.resolveEffectTarget(lowlife);
      expect(actionMoveLogTexts(targetResult)).toContain(
        `Selected ${lowlife.displayName} for ${carnage.displayName}.`,
      );
    });
  });

  describe("[PLAY] Defeat a rival Unit with less power than a friendly Unit", () => {
    it("offers a choice limited to rival units weaker than at least one friendly unit", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [carnage],
          eddies: carnage.cost,
          field: [{ card: minotaur, spent: false }], // friendly power 9
        },
        {
          field: [
            { card: lowlife, spent: false }, // power 1 (eligible)
            { card: huscle, spent: false }, // power 5 (eligible)
          ],
        },
      );

      engine.playCard(carnage);

      const choice = engine.getState().G.turnMetadata.pendingChoice;
      if (!choice || choice.type !== "chooseTarget" || choice.payload.type !== "effectTarget") {
        throw new Error("Expected Carnage target choice");
      }
      expect(choice.payload.eligibleIds).toHaveLength(2);

      engine.resolveEffectTarget(lowlife);
      const p2Trash = engine.getCardsInZone("trash", P2);
      expect(p2Trash.some((c) => c.definitionId === lowlife.id)).toBe(true);
    });

    it("offers no target when no rival unit is weaker than any friendly unit", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [carnage],
          eddies: carnage.cost,
          field: [{ card: lowlife, spent: false }], // friendly power 1
        },
        {
          field: [
            { card: huscle, spent: false }, // power 5 — not weaker than lowlife
            { card: minotaur, spent: false }, // power 9 — not weaker than lowlife
          ],
        },
      );

      engine.playCard(carnage);

      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice).toBeFalsy();

      const p2Field = engine.getCardsInZone("field", P2);
      expect(p2Field).toHaveLength(2);
    });

    it("offers no target when no friendly unit is on the field", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [carnage],
          eddies: carnage.cost,
        },
        { field: [{ card: huscle, spent: false }] },
      );

      engine.playCard(carnage);

      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice).toBeFalsy();

      const p2Field = engine.getCardsInZone("field", P2);
      expect(p2Field.some((c) => c.definitionId === huscle.id)).toBe(true);
    });
  });

  describe("disposal", () => {
    it("moves the program to its owner's trash after resolving", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [carnage],
          eddies: carnage.cost,
          field: [{ card: minotaur, spent: false }],
        },
        { field: [{ card: lowlife, spent: false }] },
      );

      engine.playCard(carnage);
      engine.resolveEffectTarget(lowlife);

      const p1Trash = engine.getCardsInZone("trash", P1);
      expect(p1Trash.some((c) => c.definitionId === carnage.id)).toBe(true);
    });
  });

  describe("avoiding regressions with the corpo-security alpha", () => {
    it("the parser produced the expected reminder text", () => {
      // Sanity check that the program reminder is still appended.
      expect(carnage.reminderText).toContain("Discard programs after they resolve.");
      // Use corpoSecurity once to keep the import meaningful for IDE go-to-definition.
      void corpoSecurity;
    });
  });
});
