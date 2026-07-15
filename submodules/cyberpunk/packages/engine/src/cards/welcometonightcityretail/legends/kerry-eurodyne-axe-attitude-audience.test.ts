import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDelamainCab,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailKerryEurodyneAxeAttitudeAudience,
  welcomeToNightCityRetailSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

function startP1TurnAndGainOnlyFixerDie(engine: CyberpunkTestEngine, rngState: number): void {
  engine.completeTurn({ as: P2 });
  const choice = engine.getState().G.turnMetadata.pendingChoice;
  expect(choice?.type).toBe("gainGig");
  if (!choice || choice.type !== "gainGig") {
    throw new Error("Expected P1 to choose a Gig at turn start.");
  }
  engine.getState().ctx.rngState = { state: rngState };
  engine.gainGig(choice.payload.allowedDieIds[0]!, { as: P1 });
}

function resolveKerryRollTriggersByDecliningReroll(engine: CyberpunkTestEngine): void {
  const choice = engine.getState().G.turnMetadata.pendingChoice;
  expect(choice?.type).toBe("chooseTrigger");
  if (!choice || choice.type !== "chooseTrigger") {
    throw new Error("Expected Kerry's roll triggers to be pending.");
  }
  const rerollTrigger = choice.payload.options[0];
  if (!rerollTrigger) throw new Error("Expected Kerry's reroll trigger option.");
  engine.executeMove("resolveTrigger", { args: { triggerId: rerollTrigger.triggerId } }, P1);

  engine.resolveEffectTargetIds([], { as: P1 });
}

const rerollAbilityText =
  "When you roll in a Gig from your fixer area, you may ignore the result and reroll it once.";

function expectNoKerryRerollPrompt(engine: CyberpunkTestEngine): void {
  const pending = engine.getState().G.turnMetadata.pendingChoice;
  if (pending?.type === "chooseTrigger") {
    expect(pending.payload.options.map((option) => option.abilityText)).not.toContain(
      rerollAbilityText,
    );
  }
  if (pending?.type === "chooseTarget") {
    expect(engine.getState().G.turnMetadata.currentTrigger?.abilityIndex).not.toBe(0);
  }
}

function resolveKerryRerollPrompt(engine: CyberpunkTestEngine, dieId: string): void {
  const choice = engine.getState().G.turnMetadata.pendingChoice;
  if (choice?.type === "chooseTrigger") {
    const rerollTrigger = choice.payload.options.find(
      (option) => option.abilityText === rerollAbilityText,
    );
    if (!rerollTrigger) throw new Error("Expected Kerry's reroll trigger option.");
    engine.executeMove("resolveTrigger", { args: { triggerId: rerollTrigger.triggerId } }, P1);
    engine.executeMove("resolveEffectTarget", { args: { targetIds: [dieId] } }, P1);
    return;
  }

  expect(choice?.type).toBe("chooseTarget");
  expect(engine.getState().G.turnMetadata.currentTrigger?.abilityIndex).toBe(0);
  engine.executeMove("resolveEffectTarget", { args: { targetIds: [dieId] } }, P1);
}

describe("Kerry Eurodyne - Axe, Attitude, Audience", () => {
  it("draws 1 after rolling a max non-d20 Gig and declining the optional reroll", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailDelamainCab],
        legendArea: [
          { card: welcomeToNightCityRetailKerryEurodyneAxeAttitudeAudience, faceDown: false },
        ],
        fixerDice: ["d4"],
      },
      { deck: [welcomeToNightCityRetailFieldOperator] },
      { activePlayerId: P2, autoGainGig: false, preserveDeckOrder: true },
    );

    startP1TurnAndGainOnlyFixerDie(engine, 1);
    resolveKerryRollTriggersByDecliningReroll(engine);

    expect(engine.getGigDice(P1).find((die) => die.dieType === "d4")?.faceValue).toBe(4);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailCorpoSecurity.id,
      welcomeToNightCityRetailDelamainCab.id,
    ]);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("does not offer the min-or-max draw trigger after a non-boundary roll", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailDelamainCab],
        legendArea: [
          { card: welcomeToNightCityRetailKerryEurodyneAxeAttitudeAudience, faceDown: false },
        ],
        fixerDice: ["d10"],
      },
      { deck: [welcomeToNightCityRetailFieldOperator] },
      { activePlayerId: P2, autoGainGig: false, preserveDeckOrder: true },
    );

    startP1TurnAndGainOnlyFixerDie(engine, 13);

    expect(engine.getGigDice(P1).find((die) => die.dieType === "d10")?.faceValue).toBe(9);
    const pending = engine.getState().G.turnMetadata.pendingChoice;
    if (pending?.type === "chooseTrigger") {
      expect(pending.payload.options.map((option) => option.abilityText)).toEqual([
        "When you roll in a Gig from your fixer area, you may ignore the result and reroll it once.",
      ]);
      return;
    }

    expect(pending?.type).toBe("chooseTarget");
    expect(engine.getState().G.turnMetadata.currentTrigger?.abilityIndex).toBe(0);
  });

  it("draws 3 instead after rolling a max d20 Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailDelamainCab,
          welcomeToNightCityRetailFieldOperator,
          welcomeToNightCityRetailSwordwiseHuscle,
        ],
        legendArea: [
          { card: welcomeToNightCityRetailKerryEurodyneAxeAttitudeAudience, faceDown: false },
        ],
        fixerDice: ["d20"],
      },
      { deck: [welcomeToNightCityRetailFieldOperator] },
      { activePlayerId: P2, autoGainGig: false, preserveDeckOrder: true },
    );

    startP1TurnAndGainOnlyFixerDie(engine, 21);
    resolveKerryRollTriggersByDecliningReroll(engine);

    expect(engine.getGigDice(P1).find((die) => die.dieType === "d20")?.faceValue).toBe(20);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailCorpoSecurity.id,
      welcomeToNightCityRetailDelamainCab.id,
      welcomeToNightCityRetailFieldOperator.id,
      welcomeToNightCityRetailSwordwiseHuscle.id,
    ]);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("does not offer the reroll ability again after rerolling the just-rolled Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailDelamainCab],
        legendArea: [
          { card: welcomeToNightCityRetailKerryEurodyneAxeAttitudeAudience, faceDown: false },
        ],
        fixerDice: ["d12"],
      },
      { deck: [welcomeToNightCityRetailFieldOperator] },
      { activePlayerId: P2, autoGainGig: false, preserveDeckOrder: true },
    );

    startP1TurnAndGainOnlyFixerDie(engine, 13);
    const die = engine.getGigDice(P1).find((candidate) => candidate.dieType === "d12");
    if (!die) throw new Error("Expected P1 to have gained the d12.");

    resolveKerryRerollPrompt(engine, die.id);

    const rollEvents = engine.getEvents("gigDieRolled").filter((event) => event.dieId === die.id);
    expect(rollEvents.map((event) => event.origin)).toEqual(["gainGig", "reroll"]);
    expect(rollEvents[1]?.previousValue).toBe(rollEvents[0]?.result);

    const rerollLog = engine
      .getEvents("actionLog")
      .find((event) => event.messageKey === "trigger.targetResolved.rerollGig");
    expect(rerollLog?.params).toMatchObject({
      targetNames: "D12",
      sourceCardName: "Kerry Eurodyne — Axe, Attitude, Audience",
      previousValue: rollEvents[0]?.result,
      newValue: rollEvents[1]?.result,
    });
    expectNoKerryRerollPrompt(engine);
  });
});
