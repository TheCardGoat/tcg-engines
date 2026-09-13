import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { lungingPressBlue } from "../attack-reactions/lunging-press.ts";
import { nimblismBlue } from "./nimblism.ts";
import { bondsOfAgonyBlue } from "./bonds-of-agony.ts";

describe("Bonds of Agony (MST103) AAA", () => {
  it("happy: stealth attack deals printed 1", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [bondsOfAgonyBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(bondsOfAgonyBlue);
    expectCombat(game).toHaveAttackPower(1);
    expectCombat(game).toHaveKeyword("stealth");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(19);
  });

  it("boundary: a miss does not look at their hand", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [bondsOfAgonyBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(bondsOfAgonyBlue);
    game.advanceCombatTo("defend");
    Dash.defendWith(nimblismBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Dash).toHaveHandCount(0);
  });

  it("timing: 3+ attack reactions this chain link grant +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [bondsOfAgonyBlue, lungingPressBlue, lungingPressBlue, lungingPressBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    const presses = Arakni.cardsIn("hand", lungingPressBlue);
    Arakni.playAttack(bondsOfAgonyBlue);
    game.advanceCombatTo("reaction");
    Arakni.must.playReaction(presses[0]!);
    game.passBoth();
    Arakni.must.playReaction(presses[1]!);
    game.passBoth();
    Arakni.must.playReaction(presses[2]!);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(7);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(13);
  });
});
