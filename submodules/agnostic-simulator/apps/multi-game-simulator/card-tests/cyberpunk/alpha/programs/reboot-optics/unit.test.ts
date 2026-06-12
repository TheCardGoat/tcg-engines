import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  registerMatchers,
  expectCardPlayable,
  expectPendingChoice,
  expectEligibleTargets,
  expectTargetChoice,
} from "@cyberpunk-engine/testing/index.ts";
import {
  alphaRebootOptics,
  alphaRuthlessLowlife,
  alphaSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { enMessages, formatActionLog } from "@cyberpunk-engine/logging/index.ts";

registerMatchers();

const program = alphaRebootOptics; // cost 2, program
const lowlife = alphaRuthlessLowlife; // cost 2, power 1, unit
const huscle = alphaSwordwiseHuscle; // cost 3, power 5, unit

function rebootOpticsChoice(engine: CyberpunkTestEngine) {
  const choice = engine.getState().G.turnMetadata.pendingChoice;
  expect(choice?.type).toBe("chooseTarget");
  if (!choice || choice.type !== "chooseTarget" || choice.payload.type !== "effectTarget") {
    throw new Error("Expected Reboot Optics target choice");
  }
  return choice;
}

function eligibleDefinitions(engine: CyberpunkTestEngine): string[] {
  return (rebootOpticsChoice(engine).payload.eligibleIds ?? []).map(
    (id) => engine.getState().G.cardIndex[id]!.definitionId,
  );
}

function actionLogTexts(engine: CyberpunkTestEngine): string[] {
  return engine
    .getEvents("actionLog")
    .filter((event) => event.type === "actionLog")
    .map((event) => formatActionLog(event, enMessages));
}

describe("Reboot Optics", () => {
  describe("UI prompt", () => {
    it("shows the program as playable", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [program],
        eddies: program.cost,
      });
      expectCardPlayable(engine, program);
    });

    it("presents the correct targets after playing", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [program],
        eddies: program.cost,
        field: [{ card: lowlife, spent: false }],
      });
      engine.playCard(program);
      expectPendingChoice(engine, "chooseTarget");
      expectTargetChoice(engine, { type: "effectTarget", targetKind: "card", min: 1, max: 1 });
      expectEligibleTargets(engine, [lowlife]);
    });
  });

  describe(`Give a friendly unit +4 power this turn. Defeat it at the end of the turn.`, () => {
    it("gives the target unit +4 effective power", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [program],
        eddies: program.cost,
        field: [{ card: lowlife, spent: false }],
      });

      engine.playCard(program);
      engine.resolveEffectTarget(lowlife);

      const instance = engine.getCard(lowlife, "field", P1);
      // Ruthless Lowlife base power 1 + 4 = 5
      expect(engine.getState()).toHaveEffectivePower({
        card: instance.instanceId as string,
        value: 5,
      });
    });

    it("program goes to trash after resolving", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [program],
        eddies: program.cost,
        field: [{ card: lowlife, spent: false }],
      });

      engine.playCard(program);
      engine.resolveEffectTarget(lowlife);

      const p1Trash = engine.getCardsInZone("trash", P1);
      expect(p1Trash.some((c) => c.definitionId === program.id)).toBe(true);
    });

    it("deducts 2 eddies from the player", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [program],
        eddies: 4,
        field: [{ card: lowlife, spent: false }],
      });

      engine.playCard(program);

      expect(engine.getEddies(P1)).toBe(2); // 4 - 2
    });

    it("unit is defeated at end of turn", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [program],
        eddies: program.cost,
        field: [{ card: lowlife, spent: false }],
      });

      engine.playCard(program);
      engine.resolveEffectTarget(lowlife);

      // Unit should still be on field before turn ends
      const fieldBefore = engine.getCardsInZone("field", P1);
      expect(fieldBefore.some((c) => c.definitionId === lowlife.id)).toBe(true);

      // End the turn — delayed defeat triggers
      engine.passPhase(); // end turn

      const p1Trash = engine.getCardsInZone("trash", P1);
      expect(p1Trash.some((c) => c.definitionId === lowlife.id)).toBe(true);

      expect(actionLogTexts(engine)).toContain(
        `${program.displayName} defeated ${lowlife.displayName} at the end of the turn.`,
      );
    });

    it("buffed unit can win a fight it would normally lose", () => {
      // Lowlife (power 1 + 4 = 5) vs Huscle (power 5) → mutual destruction
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [program],
          eddies: program.cost,
          field: [{ card: lowlife, spent: false }],
        },
        { field: [{ card: huscle, spent: true }] },
      );

      engine.playCard(program);
      engine.resolveEffectTarget(lowlife);

      engine.attackUnit(lowlife, huscle);
      engine.resolveFullFight();

      // Both are power 5 → mutual destruction (both trashed)
      const p2Trash = engine.getCardsInZone("trash", P2);
      expect(p2Trash.some((c) => c.definitionId === huscle.id)).toBe(true);
    });

    it("power buff does not affect rival units", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [program],
          eddies: program.cost,
          field: [
            { card: lowlife, spent: false },
            { card: huscle, spent: false },
          ],
        },
        { field: [{ card: huscle, spent: false }] },
      );

      engine.playCard(program);
      engine.resolveEffectTarget(lowlife);

      // Rival's huscle should still be at base power 5 (not buffed)
      const huscleInstance = engine.getCard(huscle, "field", P2);
      expect(engine.getState()).toHaveEffectivePower({
        card: huscleInstance.instanceId as string,
        value: 5,
      });
    });

    it("offers only friendly field units as eligible targets", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [program],
          eddies: program.cost,
          field: [
            { card: lowlife, spent: false },
            { card: huscle, spent: true },
          ],
        },
        { field: [{ card: huscle, spent: false }] },
      );

      engine.playCard(program);

      expect(eligibleDefinitions(engine).sort((a, b) => a.localeCompare(b))).toEqual(
        [huscle.id, lowlife.id].sort((a, b) => a.localeCompare(b)),
      );
    });

    it("buffs only the selected friendly unit when multiple valid targets exist", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [program],
        eddies: program.cost,
        field: [
          { card: lowlife, spent: false },
          { card: huscle, spent: false },
        ],
      });

      engine.playCard(program);
      engine.resolveEffectTarget(lowlife);

      const lowlifeInstance = engine.getCard(lowlife, "field", P1);
      const huscleInstance = engine.getCard(huscle, "field", P1);
      expect(engine.getState()).toHaveEffectivePower({
        card: lowlifeInstance.instanceId as string,
        value: 5,
      });
      expect(engine.getState()).toHaveEffectivePower({
        card: huscleInstance.instanceId as string,
        value: 5,
      });
    });

    it("has no effect when there are no friendly field units to target", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [program],
        eddies: program.cost,
      });

      const result = engine.playCard(program);

      expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
      expect(engine.getCardsInZone("trash", P1).some((c) => c.definitionId === program.id)).toBe(
        true,
      );
      expect(actionLogTexts(engine)).toContain(`${program.displayName} had no valid targets.`);
      expect(
        result.moveLogs
          .filter((log) => log.type === "action")
          .map((log) => formatActionLog({ ...log, type: "actionLog" }, enMessages)),
      ).toEqual([
        `Played ${program.displayName} for ${program.cost} eddies.`,
        `${program.displayName} had no valid targets.`,
      ]);
    });

    it("fails when player has insufficient eddies", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [program],
        eddies: 1,
        field: [{ card: lowlife, spent: false }],
      });
      engine.spendAllLegends();

      const failure = engine.expectFailure(() => engine.playCard(program));
      expect(failure.errorCode).toBe("INSUFFICIENT_EDDIES");
    });

    it("emits an action log for playing the program", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [program],
        eddies: program.cost,
        field: [{ card: lowlife, spent: false }],
      });

      engine.playCard(program);

      const log = engine.getLastActionLog();
      expect(log).toBeDefined();
      expect(log!.messageKey).toBe("move.playCard");
      expect(log!.params.cardName).toBe(program.displayName);

      const text = formatActionLog(log!, enMessages);
      expect(text).toContain(program.displayName);
    });

    it("emits an action log naming the selected target", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [program],
        eddies: program.cost,
        field: [{ card: lowlife, spent: false }],
      });

      engine.playCard(program);
      engine.resolveEffectTarget(lowlife);

      expect(actionLogTexts(engine)).toContain(
        `Selected ${lowlife.displayName} for ${program.displayName}.`,
      );
    });

    it("keeps both target-selection and delayed-defeat logs", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [program],
        eddies: program.cost,
        field: [{ card: lowlife, spent: false }],
      });

      engine.playCard(program);
      engine.resolveEffectTarget(lowlife);
      engine.passPhase(); // end turn

      expect(actionLogTexts(engine)).toEqual(
        expect.arrayContaining([
          `Selected ${lowlife.displayName} for ${program.displayName}.`,
          `${program.displayName} defeated ${lowlife.displayName} at the end of the turn.`,
        ]),
      );
    });
  });
});
