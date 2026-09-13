/**
 * Public fluent asserts that card tests must use instead of getState().
 */
import { describe, expect, it } from "vite-plus/test";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectWait,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "./index.ts";
import { bravo, dash, scabskinLeathers, snatchRed } from "../rules/fixtures.ts";
import { rhinar } from "../../../cards/src/cards/heroes/rhinar.ts";
import { gold } from "../../../cards/src/cards/tokens/gold.ts";
import { kassaiOfTheGoldenSand } from "../../../cards/src/cards/heroes/kassai-of-the-golden-sand.ts";
import { raiseAnArmyYellow } from "../../../cards/src/cards/actions/raise-an-army.ts";

describe("expectFabPlayer CR-visible flags", () => {
  it("toBeMarked follows seating and notToBeMarked is the contrast", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, marked: true, hand: [], deck: 6 },
    );
    expectFabPlayer(game.as(dash)).toBeMarked();
    expectFabPlayer(game.as(bravo)).notToBeMarked();
    expect(() => expectFabPlayer(game.as(bravo)).toBeMarked()).toThrow(/marked/);
  });

  it("contract, diplomacy, charged, and crowd-booed start empty", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);
    expectFabPlayer(Bravo).toHaveActiveContract(null);
    expectFabPlayer(Bravo).toHaveDiplomacyChoice(null);
    expectFabPlayer(Bravo).notToHaveChargedThisTurn();
    expectFabPlayer(Bravo).notToHaveCrowdBooedThisTurn();
  });
});

describe("expectWait", () => {
  it("toBeIdle at action-phase start", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );
    expectWait(game).toBeIdle();
  });

  it("toHaveDecision + chooseNumeric pin a numeric X prompt", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        hand: [raiseAnArmyYellow],
        arena: [gold, gold],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);
    Kassai.exec({
      move: "begin-play",
      payload: { instanceId: Kassai.findCardInZone("hand", raiseAnArmyYellow) },
    });
    expectWait(game).toHaveDecision("numeric");
    expect(() => Kassai.chooseNumeric(3)).toThrow(/outside/);
    Kassai.chooseNumeric(2);
    expectWait(game).toHaveDecision("entity-target");
  });
});

describe("expectFabCard freeze and supertype", () => {
  it("toHaveSupertype reads the evaluated type box", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );
    expectFabCard(game.as(bravo), snatchRed).notToHaveSupertype("Draconic");
  });

  it("toBeFrozen follows the frozen marker", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], arsenal: [snatchRed], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);
    const arsenalId = Bravo.findCardInZone("arsenal", snatchRed);
    const record = game.getState().objects[arsenalId]!;
    game.getState().objects[arsenalId] = {
      ...record,
      markers: [...record.markers, { kind: "frozen" }],
    };
    expectFabCard(Bravo, Bravo.cardIn("arsenal", snatchRed)).toBeFrozen();
    expectFabCard(Bravo, Bravo.cardIn("hand", snatchRed)).notToBeFrozen();
  });
});

describe("expectCombat public facts", () => {
  it("toHaveAttackSupertype reads the active-link source", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(bravo).playAttack(snatchRed);
    expectCombat(game).notToHaveAttackSupertype("Draconic");
  });

  it("toHaveClashWinner reads the last clash winner", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);
    game.getState().lastClashWinnerId = Bravo.id;
    expectCombat(game).toHaveClashWinner(Bravo);
  });
});

describe("lastDieFace", () => {
  it("throws when the journal has no roll", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );
    expect(() => game.lastDieFace()).toThrow(/No committed die face/);
  });

  it("returns the face after Scabskin Leathers rolls", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        legs: [scabskinLeathers],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    game.as(rhinar).must.activate(scabskinLeathers);
    const face = game.lastDieFace();
    expect(face).toBeGreaterThanOrEqual(1);
    expect(face).toBeLessThanOrEqual(6);
  });
});
