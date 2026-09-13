import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { arcaniteSkullcap } from "./arcanite-skullcap.ts";

describe("Arcanite Skullcap (ARC150) AAA", () => {
  it("happy: behind on life → d2 and Arcane Barrier 3", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 15,
        resourcePoints: 3,
        head: [arcaniteSkullcap],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expectFabCard(Dash, arcaniteSkullcap).toHaveDefense(2);
    expectFabCard(Dash, arcaniteSkullcap).toHaveKeyword("arcane-barrier");
    expectFabCard(Dash, arcaniteSkullcap).toHaveKeyword("battleworn");

    game.as(blazeFiremind).play(volticBoltRed, { target: Dash.id });
    game.passBoth();
    const choice = Dash.expectDecision("option");
    Dash.chooseOptions(choice.options[0]!.id);

    expectFabPlayer(Dash).toHaveLife(13);
    expectFabPlayer(Dash).toHaveResourceCount(0);
    expectFabCard(Dash, arcaniteSkullcap).toBeIn("head");
  });

  it("boundary: not behind → d1 and no Arcane Barrier 3", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        resourcePoints: 3,
        head: [arcaniteSkullcap],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expectFabCard(Dash, arcaniteSkullcap).toHaveDefense(1);
    expectFabCard(Dash, arcaniteSkullcap).notToHaveKeyword("arcane-barrier");

    game.as(blazeFiremind).play(volticBoltRed, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabPlayer(Dash).toHaveResourceCount(3);
    expectFabCard(Dash, arcaniteSkullcap).toBeIn("head");
  });

  it("timing: battleworn on defend stamps −1{d} and the helm stays seated", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 15, head: [arcaniteSkullcap], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(arcaniteSkullcap);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, arcaniteSkullcap).toBeIn("head");
    expectFabCard(Dash, arcaniteSkullcap).toHaveDefenseCounters(-1);
    expectFabPlayer(Dash).toHaveLife(13);
  });
});
