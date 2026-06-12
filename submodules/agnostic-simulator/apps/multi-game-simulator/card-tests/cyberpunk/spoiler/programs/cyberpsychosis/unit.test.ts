import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  registerMatchers,
  expectCardPlayable,
  expectPendingChoice,
  expectEligibleTargetCount,
  expectTargetChoice,
} from "@cyberpunk-engine/testing/index.ts";
import type { ActionLogEvent } from "@cyberpunk-engine/types/game-events.ts";
import {
  alphaMantisBlades,
  alphaMandibularUpgrade,
  alphaRuthlessLowlife,
  alphaSwordwiseHuscle,
  alphaVCorporateExile,
  spoilerCyberpsychosis,
} from "@tcg/cyberpunk-cards";
import { enMessages, formatActionLog } from "@cyberpunk-engine/logging/index.ts";

registerMatchers();

const program = spoilerCyberpsychosis; // cost 2, event-timing program
const huscle = alphaSwordwiseHuscle; // cost 3, power 5, unit
const lowlife = alphaRuthlessLowlife; // cost 2, power 1, unit
const mantis = alphaMantisBlades; // cost 1, power 2, gear
const mandibular = alphaMandibularUpgrade; // cost 1, power 0, gear
const v = alphaVCorporateExile; // face-up legend, power 3

function setupForAttackWindow(opts: { extraGear?: boolean; eddies?: number } = {}) {
  const engine = CyberpunkTestEngine.createWithFixture(
    {
      hand: opts.extraGear ? [program, mantis, mandibular] : [program, mantis],
      eddies: opts.eddies ?? 8,
      field: [
        { card: huscle, spent: false },
        { card: lowlife, spent: false },
      ],
      legendArea: [{ card: v, faceDown: false }],
    },
    {},
  );

  engine.attachGear(mantis, huscle);
  if (opts.extraGear) {
    engine.attachGear(mandibular, huscle);
  }
  return engine;
}

function pendingEffectChoice(engine: CyberpunkTestEngine) {
  const choice = engine.getState().G.turnMetadata.pendingChoice;
  expect(choice?.type).toBe("chooseTarget");
  if (!choice || choice.type !== "chooseTarget" || choice.payload.type !== "effectTarget") {
    throw new Error("Expected an effect target choice");
  }
  return choice;
}

function pendingTriggerChoice(engine: CyberpunkTestEngine) {
  const choice = engine.getState().G.turnMetadata.pendingChoice;
  expect(choice?.type).toBe("chooseTrigger");
  if (!choice || choice.type !== "chooseTrigger") {
    throw new Error("Expected a trigger choice");
  }
  return choice;
}

function chooseCyberpsychosis(engine: CyberpunkTestEngine) {
  const option = pendingTriggerChoice(engine).payload.options.find(
    (trigger) => trigger.cardName === program.displayName,
  );
  expect(option).toBeDefined();
  engine.executeMove("resolveTrigger", { args: { triggerId: option!.triggerId } }, P1);
}

function eligibleDefinitions(engine: CyberpunkTestEngine): string[] {
  return (pendingEffectChoice(engine).payload.eligibleIds ?? []).map(
    (id) => engine.getState().G.cardIndex[id]!.definitionId,
  );
}

describe("Cyberpsychosis", () => {
  describe("UI prompt", () => {
    it("shows the program as playable", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [program],
        eddies: program.cost,
      });
      expectCardPlayable(engine, program);
    });

    it("presents the correct number of targets when triggered during attack", () => {
      const engine = setupForAttackWindow({ eddies: program.cost });

      engine.attackRival(huscle);
      chooseCyberpsychosis(engine);

      expectPendingChoice(engine, "chooseTarget");
      expectTargetChoice(engine, { type: "effectTarget", targetKind: "card", min: 1, max: 1 });
      expectEligibleTargetCount(engine, 1);
    });
  });

  describe(`You may also play this Program when a Unit attacks by paying this card's cost and spending a friendly Unit or face-up Legend. Give an equipped Unit +2 power this turn for each of its equipped Gear. Defeat the Unit at the end of this turn.`, () => {
    it("offers its play window as an optional choice when a unit attacks, before the defensive step", () => {
      const engine = setupForAttackWindow();

      engine.attackRival(huscle);

      expect(engine.getAttackState()?.step).toBe("offensive");
      const choice = pendingTriggerChoice(engine);
      expect(choice.payload.canPass).toBe(true);
      expect(choice.payload.options).toMatchObject([
        {
          cardName: program.displayName,
          optional: true,
        },
      ]);
    });

    it("can decline the Cyberpsychosis window without paying costs or moving the program", () => {
      const engine = setupForAttackWindow();

      engine.attackRival(huscle);
      engine.executeMove("resolveTrigger", { args: { pass: true } }, P1);

      expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
      expect(engine.getEddies(P1)).toBe(7);
      expect(engine.getCardsInZone("hand", P1).some((c) => c.definitionId === program.id)).toBe(
        true,
      );
    });

    it("asks which equipped unit receives Cyberpsychosis after the player chooses it", () => {
      const engine = setupForAttackWindow();

      engine.attackRival(huscle);
      chooseCyberpsychosis(engine);

      expect(pendingEffectChoice(engine).payload.selectedBindingId).toBe("selectedUnit");
    });

    it("asks which equipped unit receives Cyberpsychosis", () => {
      const engine = setupForAttackWindow();

      engine.attackRival(huscle);
      chooseCyberpsychosis(engine);

      expect(eligibleDefinitions(engine)).toEqual([huscle.id]);
    });

    it("then asks which additional-cost card to spend", () => {
      const engine = setupForAttackWindow();

      engine.attackRival(huscle);
      chooseCyberpsychosis(engine);
      engine.resolveEffectTarget(huscle);

      expect(eligibleDefinitions(engine).sort((a, b) => a.localeCompare(b))).toEqual(
        [lowlife.id, v.id].sort((a, b) => a.localeCompare(b)),
      );
    });

    it("pays the card cost and spends the selected friendly unit", () => {
      const engine = setupForAttackWindow();

      engine.attackRival(huscle);
      chooseCyberpsychosis(engine);
      engine.resolveEffectTarget(huscle);
      engine.resolveEffectTarget(lowlife);

      expect(engine.getEddies(P1)).toBe(5);
      expect(engine.getCard(lowlife, "field", P1).meta.spent).toBe(true);
      expect(engine.getCard(v, "legendArea", P1).meta.spent).toBe(false);
    });

    it("can spend a face-up legend instead of a unit for the additional cost", () => {
      const engine = setupForAttackWindow();

      engine.attackRival(huscle);
      chooseCyberpsychosis(engine);
      engine.resolveEffectTarget(huscle);
      engine.resolveEffectTarget(v);

      expect(engine.getCard(v, "legendArea", P1).meta.spent).toBe(true);
      expect(engine.getCard(lowlife, "field", P1).meta.spent).toBe(false);
    });

    it("does not offer the attacking unit as the additional cost after it is spent to attack", () => {
      const engine = setupForAttackWindow();

      engine.attackRival(huscle);
      chooseCyberpsychosis(engine);
      engine.resolveEffectTarget(huscle);

      expect(eligibleDefinitions(engine)).not.toContain(huscle.id);
    });

    it("moves the program from hand to trash after the special-timing play resolves", () => {
      const engine = setupForAttackWindow();

      engine.attackRival(huscle);
      chooseCyberpsychosis(engine);
      engine.resolveEffectTarget(huscle);
      engine.resolveEffectTarget(lowlife);

      expect(engine.getCardsInZone("hand", P1).some((c) => c.definitionId === program.id)).toBe(
        false,
      );
      expect(engine.getCardsInZone("trash", P1).some((c) => c.definitionId === program.id)).toBe(
        true,
      );
    });

    it("gives the equipped unit +2 power per gear this turn", () => {
      const engine = setupForAttackWindow({ extraGear: true });

      engine.attackRival(huscle);
      chooseCyberpsychosis(engine);
      engine.resolveEffectTarget(huscle);
      engine.resolveEffectTarget(lowlife);

      const instance = engine.getCard(huscle, "field", P1);
      expect(engine.getState()).toHaveEffectivePower({
        card: instance.instanceId as string,
        value: 11,
      });
    });

    it("defeats the selected equipped unit at end of turn", () => {
      const engine = setupForAttackWindow();

      engine.attackRival(huscle);
      chooseCyberpsychosis(engine);
      engine.resolveEffectTarget(huscle);
      engine.resolveEffectTarget(v);
      engine.resolveAttack();
      engine.resolveAttack({ as: P2, pass: true });
      engine.resolveAttack();
      engine.passPhase();

      expect(engine.getCardsInZone("trash", P1).some((c) => c.definitionId === huscle.id)).toBe(
        true,
      );
    });

    it("does not open the attack window without enough eddies to pay for the program", () => {
      const engine = setupForAttackWindow({ eddies: 2 });
      engine.spendAllLegends();

      engine.attackRival(huscle);

      expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
      expect(engine.getCardsInZone("hand", P1).some((c) => c.definitionId === program.id)).toBe(
        true,
      );
    });

    it("emits readable logs for the attack-window play and target selection", () => {
      const engine = setupForAttackWindow();

      engine.attackRival(huscle);
      chooseCyberpsychosis(engine);
      engine.resolveEffectTarget(huscle);
      engine.resolveEffectTarget(lowlife);

      const logs = engine.getEvents("actionLog") as ActionLogEvent[];
      expect(logs.some((log) => log.messageKey === "trigger.resolved")).toBe(true);
      expect(logs.some((log) => log.messageKey === "trigger.targetResolved")).toBe(true);
      expect(formatActionLog(logs.at(-1)!, enMessages)).toContain(lowlife.displayName);
    });
  });
});
