import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { uzuri } from "../heroes/uzuri.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { shakeDownRed } from "./shake-down.ts";

describe("Shake Down (OUT013) AAA", () => {
  it("boundary: without an attack reaction this chain, a hit does not banish", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        hand: [shakeDownRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Uzuri = game.as(uzuri);
    const Dash = game.as(dash);
    Uzuri.playAttack(shakeDownRed);
    expectCombat(game).toHaveAttackPower(6);
    game.helpers.resolveRestOfCombat();
    expect(Dash.zone("hand")).toContain(nimblismBlue.canonicalId);
    expectFabPlayer(Dash).toHaveLife(14);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: uzuri, hand: [shakeDownRed], life: 20, deck: 6 },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Uzuri = game.as(uzuri);
    const Dash = game.as(dash);
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Uzuri.defendWith([shakeDownRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Uzuri).toHaveLife(19);
  });
});
