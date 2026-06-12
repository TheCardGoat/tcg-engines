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
  alphaCorpoSecurity,
  alphaCorporateSurveillance,
  alphaRuthlessLowlife,
  alphaEmergencyAtlus,
  alphaJackieWellesRideOrDieChoom,
  alphaSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { enMessages, formatActionLog } from "@cyberpunk-engine/logging/index.ts";

const program = alphaCorporateSurveillance; // cost 2, program
const corpo = alphaCorpoSecurity; // cost 2, unit
const lowlife = alphaRuthlessLowlife; // cost 2, unit
const huscle = alphaSwordwiseHuscle; // cost 3, unit
const atlus = alphaEmergencyAtlus; // cost 4, unit
const jackie = alphaJackieWellesRideOrDieChoom; // cost 6, unit

function corporateSurveillanceChoice(engine: CyberpunkTestEngine) {
  const choice = engine.getState().G.turnMetadata.pendingChoice;
  expect(choice?.type).toBe("chooseTarget");
  if (!choice || choice.type !== "chooseTarget" || choice.payload.type !== "effectTarget") {
    throw new Error("Expected Corporate Surveillance target choice");
  }
  return choice;
}

function eligibleDefinitions(engine: CyberpunkTestEngine): string[] {
  return (corporateSurveillanceChoice(engine).payload.eligibleIds ?? []).map(
    (id) => engine.getState().G.cardIndex[id]!.definitionId,
  );
}

describe("Corporate Surveillance", () => {
  describe("UI prompt", () => {
    it("shows the program as playable", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [program],
        eddies: program.cost,
      });
      expectCardPlayable(engine, program);
    });

    it("presents the correct targets after playing", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [program], eddies: program.cost },
        { field: [{ card: lowlife, spent: false }] },
      );
      engine.playCard(program);
      expectPendingChoice(engine, "chooseTarget");
      expectTargetChoice(engine, { type: "effectTarget", targetKind: "card", min: 1, max: 1 });
      expectEligibleTargets(engine, [lowlife], { as: P2 });
    });
  });

  describe(`Spend a rival unit with cost 3 or less.`, () => {
    it("spends a rival unit with cost <= 3", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [program], eddies: program.cost },
        { field: [{ card: lowlife, spent: false }] },
      );

      engine.playCard(program);
      engine.resolveEffectTarget(lowlife);

      expect(engine.getCard(lowlife, "field", P2).meta.spent).toBe(true);
    });

    it("program goes to trash after resolving", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [program], eddies: program.cost },
        { field: [{ card: lowlife, spent: false }] },
      );

      engine.playCard(program);
      engine.resolveEffectTarget(lowlife);

      const p1Trash = engine.getCardsInZone("trash", P1);
      expect(p1Trash.some((c) => c.definitionId === program.id)).toBe(true);
    });

    it("deducts 2 eddies from the player", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [program], eddies: 4 },
        { field: [{ card: lowlife, spent: false }] },
      );

      engine.playCard(program);

      expect(engine.getEddies(P1)).toBe(2); // 4 - 2
    });

    it("can target a rival unit with cost exactly 3", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [program], eddies: program.cost },
        { field: [{ card: huscle, spent: false }] },
      );

      engine.playCard(program);
      engine.resolveEffectTarget(huscle);

      expect(engine.getCard(huscle, "field", P2).meta.spent).toBe(true);
    });

    it("can target an already-spent rival unit (becomes/stays spent)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [program], eddies: program.cost },
        { field: [{ card: lowlife, spent: true }] },
      );

      engine.playCard(program);
      engine.resolveEffectTarget(lowlife);

      expect(engine.getCard(lowlife, "field", P2).meta.spent).toBe(true);
    });

    it("offers only rival units with cost 3 or less as eligible targets", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [program],
          field: [{ card: huscle, spent: false }],
          eddies: program.cost,
        },
        {
          field: [
            { card: corpo, spent: false },
            { card: lowlife, spent: false },
            { card: jackie, spent: true },
          ],
        },
      );

      engine.playCard(program);

      expect(eligibleDefinitions(engine).sort((a, b) => a.localeCompare(b))).toEqual(
        [corpo.id, lowlife.id].sort((a, b) => a.localeCompare(b)),
      );
    });

    it("spends only the selected rival unit when multiple valid targets exist", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [program], eddies: program.cost },
        {
          field: [
            { card: corpo, spent: false },
            { card: lowlife, spent: false },
            { card: huscle, spent: false },
          ],
        },
      );

      engine.playCard(program);
      engine.resolveEffectTarget(lowlife);

      expect(engine.getCard(corpo, "field", P2).meta.spent).toBe(false);
      expect(engine.getCard(lowlife, "field", P2).meta.spent).toBe(true);
      expect(engine.getCard(huscle, "field", P2).meta.spent).toBe(false);
    });

    it("fails when player has insufficient eddies", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [program], eddies: 1 },
        { field: [{ card: lowlife, spent: false }] },
      );
      engine.spendAllLegends();

      const failure = engine.expectFailure(() => engine.playCard(program));
      expect(failure.errorCode).toBe("INSUFFICIENT_EDDIES");
    });

    it("does not spend a rival unit with cost > 3", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [program], eddies: program.cost },
        { field: [{ card: atlus, spent: false }] },
      );

      // With no valid target (cost > 3), the program still resolves but has no effect
      engine.playCard(program);

      expect(engine.getCard(atlus, "field", P2).meta.spent).toBe(false);
    });

    it("emits an action log for playing the program", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [program], eddies: program.cost },
        { field: [{ card: lowlife, spent: false }] },
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
