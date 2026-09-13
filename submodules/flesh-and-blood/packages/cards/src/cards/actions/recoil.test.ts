import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { headJabBlue } from "./head-jab.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { recoilRed } from "./recoil.ts";

describe("Recoil (OUT059) AAA", () => {
  it("happy: after Head Jab, a hit puts a card from their hand on top of their deck", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [headJabBlue, recoilRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(headJabBlue);
    game.advanceCombatTo("resolution");
    Bravo.playAttack(recoilRed);
    game.helpers.resolveRestOfCombat();

    expect(Dash.zone("deck")[Dash.zone("deck").length - 1]).toBe(nimblismBlue.canonicalId);
    expectFabPlayer(Dash).toHaveHandCount(0);
    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("boundary: without Head Jab, a hit does not bounce a card to deck", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [recoilRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(recoilRed);
    expectCombat(game).toHaveAttackPower(3);
    game.helpers.resolveRestOfCombat();

    expect(Dash.zone("hand")).toContain(nimblismBlue.canonicalId);
    expectFabPlayer(Dash).toHaveLife(17);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [recoilRed], life: 20, deck: 6 },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith([recoilRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(19);
  });
});
