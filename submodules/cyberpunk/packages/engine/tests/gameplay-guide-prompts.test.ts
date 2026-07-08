import { describe, expect, it } from "vite-plus/test";
import {
  alphaCorpoSecurity,
  alphaFloorIt,
  alphaMantisBlades,
  alphaRuthlessLowlife,
  alphaVCorporateExile,
} from "@tcg/cyberpunk-cards";
import type { Ability } from "@tcg/cyberpunk-types";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  createMockLegend,
  createMockProgram,
  createMockUnit,
  expectChoicePrompt,
  expectMoveInputSpec,
  expectMoveNotAvailable,
  expectPromptStatus,
} from "../src/testing/index.ts";

/**
 * Release audit matrix for the published Cyberpunk TCG gameplay guide:
 *
 * - setup: opening hands, face-down randomized Legends, first-player spent
 *   Legends, and mulligan coverage live in setup.test.ts.
 * - win/deck-out/overtime: covered by win-condition-*.test.ts and
 *   src/moves/win-conditions.test.ts.
 * - start phase: ready, draw, and gain-gig state changes live in
 *   flow/ready-phase.test.ts; this file adds prompt contract coverage.
 * - main phase: sell, play, call Legend, Gear attach, and action ordering live
 *   in play-phase.test.ts; this file adds prompt candidate coverage.
 * - attacks/reactions/keywords: attack.test.ts and quick-keyword.test.ts cover
 *   move legality; this file adds prompt candidate and choice-payload coverage.
 * - card types/Gear movement/Street Cred: covered by play-phase.test.ts,
 *   attack.test.ts, active-effects.test.ts, and card-local tests.
 */
describe("Gameplay guide prompt audit", () => {
  it("presents gain-a-gig as the active player's choice and excludes d20 until last", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { deck: 10 },
      { deck: 10 },
      { skipSetup: false, autoGainGig: false, seed: "guide-gain-gig-prompt" },
    );

    engine.keepHand({ as: P1 });
    engine.keepHand({ as: P2 });

    const active = engine.getActivePlayerId();
    const inactive = engine.getOpponentOf(active);
    const prompt = expectPromptStatus(engine, "choice", { as: active });
    expectPromptStatus(engine, "waiting", { as: inactive });

    const choice = expectChoicePrompt(engine, "gainGig", { as: active });
    expect(choice.chooserId).toBe(active);
    expect(prompt.availableMoves.map((move) => move.moveId)).toContain("gainGig");

    const allowedTypes = choice.payload.allowedDieIds.map(
      (id) => engine.getState().G.gigDice[id]!.dieType,
    );
    expect(allowedTypes).not.toContain("d20");
    expect(allowedTypes.sort()).toEqual(["d10", "d12", "d4", "d6", "d8"]);
  });

  it("allows d20 in the gain-a-gig prompt only when it is the last fixer die", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { deck: 10, fixerDice: ["d20"] },
      { deck: 10, fixerDice: ["d20"] },
      { skipSetup: false, autoGainGig: false, seed: "guide-gain-gig-d20-last" },
    );

    engine.keepHand({ as: P1 });
    engine.keepHand({ as: P2 });

    const active = engine.getActivePlayerId();
    const choice = expectChoicePrompt(engine, "gainGig", { as: active });
    const allowedTypes = choice.payload.allowedDieIds.map(
      (id) => engine.getState().G.gigDice[id]!.dieType,
    );
    expect(allowedTypes).toEqual(["d20"]);
  });

  it("presents main-phase guide actions with only legal candidates", () => {
    const selfSpendAbility: Ability = {
      kind: "keyword",
      text: "Spend: Ready this Unit.",
      trigger: { trigger: "activated" },
      costs: [{ cost: "spend", target: { selector: "self" } }],
      effects: [{ effect: "ready", target: { selector: "self" } }],
    };
    const activeUnit = createMockUnit({
      id: "guide-active-unit",
      name: "Guide Active Unit",
      abilities: [selfSpendAbility],
    });
    const unsellableHandUnit = createMockUnit({
      id: "guide-unsellable-hand-unit",
      name: "Guide Unsellable Hand Unit",
      hasSellTag: false,
    });
    const callableLegend = createMockLegend({
      id: "guide-callable-legend",
      name: "Guide Callable Legend",
    });

    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [alphaFloorIt, unsellableHandUnit, alphaMantisBlades],
        field: [activeUnit],
        legendArea: [
          { card: alphaVCorporateExile, faceDown: false },
          { card: callableLegend, faceDown: true },
        ],
        eddies: 8,
      },
      {
        field: [{ card: alphaCorpoSecurity, spent: true }, alphaRuthlessLowlife],
      },
    );

    expectPromptStatus(engine, "action", { as: P1 });

    const sellSpec = expectMoveInputSpec(engine, "sellCard", "selectCard", { as: P1 });
    expect(sellSpec.candidates).toContain(engine.findCardId(alphaFloorIt, "hand", P1));
    expect(sellSpec.candidates).toContain(engine.findCardId(alphaMantisBlades, "hand", P1));
    expect(sellSpec.candidates).not.toContain(engine.findCardId(unsellableHandUnit, "hand", P1));

    const playSpec = expectMoveInputSpec(engine, "playCard", "playCard", { as: P1 });
    const playCandidates = playSpec.candidates.map((candidate) => candidate.cardId);
    expect(playCandidates).toContain(engine.findCardId(unsellableHandUnit, "hand", P1));
    const gearCandidate = playSpec.candidates.find(
      (candidate) => candidate.cardId === engine.findCardId(alphaMantisBlades, "hand", P1),
    );
    expect(gearCandidate?.attachTargets).toEqual([
      engine.findCardId(activeUnit, "field", P1) as string,
      engine.findCardId(alphaVCorporateExile, "legendArea", P1) as string,
    ]);

    const callSpec = expectMoveInputSpec(engine, "callLegend", "selectCard", { as: P1 });
    expect(callSpec.candidates).toEqual([
      engine.findCardId(callableLegend, "legendArea", P1) as string,
    ]);

    const goSoloSpec = expectMoveInputSpec(engine, "goSolo", "selectCard", { as: P1 });
    expect(goSoloSpec.candidates).toEqual([
      engine.findCardId(alphaVCorporateExile, "legendArea", P1) as string,
    ]);

    const abilitySpec = expectMoveInputSpec(engine, "activateAbility", "selectAbility", {
      as: P1,
    });
    expect(abilitySpec.candidates).toEqual([
      { cardId: engine.findCardId(activeUnit, "field", P1) as string, abilityIndex: 0 },
    ]);

    const attackUnitSpec = expectMoveInputSpec(engine, "attackUnit", "selectPair", { as: P1 });
    expect(attackUnitSpec.fromCandidates).toEqual([
      engine.findCardId(activeUnit, "field", P1) as string,
    ]);
    expect(attackUnitSpec.toCandidates).toEqual([
      engine.findCardId(alphaCorpoSecurity, "field", P2) as string,
    ]);

    const attackRivalSpec = expectMoveInputSpec(engine, "attackRival", "selectCard", { as: P1 });
    expect(attackRivalSpec.candidates).toEqual([
      engine.findCardId(activeUnit, "field", P1) as string,
    ]);
  });

  it("presents defensive-step reactions with QUICK-only card and ability candidates", () => {
    const quickProgram = createMockProgram({
      id: "guide-quick-program",
      name: "Guide Quick Program",
      cost: 1,
      keywords: ["quick"],
    });
    const normalProgram = createMockProgram({
      id: "guide-normal-program",
      name: "Guide Normal Program",
      cost: 1,
    });
    const quickAbility: Ability = {
      kind: "keyword",
      text: "QUICK: Ready this Unit.",
      keyword: "quick",
      trigger: { trigger: "activated" },
      costs: [{ cost: "spend", target: { selector: "self" } }],
      effects: [{ effect: "ready", target: { selector: "self" } }],
    };
    const normalAbility: Ability = {
      kind: "keyword",
      text: "Spend: Ready this Unit.",
      trigger: { trigger: "activated" },
      costs: [{ cost: "spend", target: { selector: "self" } }],
      effects: [{ effect: "ready", target: { selector: "self" } }],
    };
    const quickUnit = createMockUnit({
      id: "guide-quick-unit",
      name: "Guide Quick Unit",
      abilities: [quickAbility],
    });
    const normalUnit = createMockUnit({
      id: "guide-normal-unit",
      name: "Guide Normal Unit",
      abilities: [normalAbility],
    });
    const attacker = createMockUnit({
      id: "guide-attacker",
      name: "Guide Attacker",
      power: 3,
    });
    const reactionLegend = createMockLegend({
      id: "guide-reaction-legend",
      name: "Guide Reaction Legend",
    });

    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [attacker] },
      {
        hand: [quickProgram, normalProgram],
        field: [quickUnit, normalUnit, alphaCorpoSecurity],
        legendArea: [{ card: reactionLegend, faceDown: true }],
        eddies: 5,
      },
      { activePlayerId: P1 },
    );

    engine.attackRival(attacker, { as: P1 });
    engine.executeMove("resolveAttack", { args: {} }, P1);

    expectPromptStatus(engine, "action", { as: P2 });
    expectPromptStatus(engine, "waiting", { as: P1 });

    const playSpec = expectMoveInputSpec(engine, "playCard", "playCard", { as: P2 });
    expect(playSpec.candidates.map((candidate) => candidate.cardId)).toEqual([
      engine.findCardId(quickProgram, "hand", P2) as string,
    ]);

    const abilitySpec = expectMoveInputSpec(engine, "activateAbility", "selectAbility", {
      as: P2,
    });
    expect(abilitySpec.candidates).toEqual([
      { cardId: engine.findCardId(quickUnit, "field", P2) as string, abilityIndex: 0 },
    ]);

    const blockerSpec = expectMoveInputSpec(engine, "useBlocker", "selectCard", { as: P2 });
    expect(blockerSpec.candidates).toEqual([
      engine.findCardId(alphaCorpoSecurity, "field", P2) as string,
    ]);

    expectMoveInputSpec(engine, "callLegend", "selectCard", { as: P2 });
    expectMoveInputSpec(engine, "resolveAttack", "none", { as: P2 });
    expectMoveNotAvailable(engine, "passPhase", { as: P2 });
  });

  it("prompts the attacker to choose exactly the Gigs a direct attack can steal", () => {
    const attacker = createMockUnit({
      id: "guide-10-power-attacker",
      name: "Guide 10 Power Attacker",
      power: 10,
    });

    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [attacker] },
      {
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 3 },
          { dieType: "d8", faceValue: 5 },
        ],
      },
    );

    engine.attackRival(attacker, { as: P1 });
    engine.executeMove("resolveAttack", { args: {} }, P1);
    engine.executeMove("resolveAttack", { args: { pass: true } }, P2);
    engine.executeMove("resolveAttack", { args: {} }, P1);

    const choice = expectChoicePrompt(engine, "chooseGigsToSteal", { as: P1 });
    expect(choice.chooserId).toBe(P1);
    expect(choice.payload.count).toBe(2);
    expect(choice.payload.attackerId).toBe(engine.findCardId(attacker, "field", P1));
    expect(choice.payload.rivalId).toBe(P2);
    expect(choice.payload.eligibleDice.map((die) => die.faceValue).sort((a, b) => a - b)).toEqual([
      1, 3, 5,
    ]);
    expectMoveInputSpec(engine, "resolveStealGigs", "none", { as: P1 });
    expectPromptStatus(engine, "waiting", { as: P2 });
  });

  it("does not expose any user action prompt after the game ends", () => {
    const engine = CyberpunkTestEngine.createWithFixture({});

    engine.concede({ as: P1 });

    const prompt = expectPromptStatus(engine, "idle", { as: P1 });
    expect(prompt.availableMoves).toEqual([]);
    expect(prompt.choice).toBeNull();
  });
});
