import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { excessiveBloodlossRed } from "./excessive-bloodloss.ts";

describe("Excessive Bloodloss (PEN144) AAA", () => {
  it("happy: hit banishes the top card and registers the red-banish contract", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [excessiveBloodlossRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deckTop: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(excessiveBloodlossRed);
    expectCombat(game).toHaveAttackPower(5);
    expectFabPlayer(Arakni).toHaveActiveContract("banish opponents' red cards");
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabCard(Dash, nimblismBlue).toBeBanished();
    expect(Dash.zone("banished")).toHaveLength(1);
  });

  it("boundary: a miss does not banish the top of their deck", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [excessiveBloodlossRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue],
        deckTop: [snatchRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(excessiveBloodlossRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([nimblismBlue, nimblismBlue, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Dash.zone("deck")).toContain(snatchRed.canonicalId);
  });

  it("timing: banishing a red card on hit repeats once and completing the contract creates Silver", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [excessiveBloodlossRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [],
        deckTop: [snatchRed, snatchRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(excessiveBloodlossRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(15);
    expect(Dash.zone("banished")).toHaveLength(2);
    expectFabPlayer(Arakni).toHaveActiveContract(null);
    expect(Arakni.zone("arena")).toContain("token:silver");
  });
});
