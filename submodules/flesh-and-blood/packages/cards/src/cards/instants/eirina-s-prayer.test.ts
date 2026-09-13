import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { eirinasPrayerRed } from "./eirina-s-prayer.ts";

describe("Eirina's Prayer (ARC173/174/175) AAA", () => {
  it("happy: revealing pitch 1 provides a five-point arcane shield", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      {
        hero: dash,
        hand: [eirinasPrayerRed],
        resourcePoints: 1,
        life: 20,
        deck: 6,
        deckTop: [snatchRed],
      },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(volticBoltRed, { target: Dash.id });
    Blaze.pass();
    Dash.play(eirinasPrayerRed);
    game.passBoth();
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Dash, eirinasPrayerRed).toBeIn("graveyard");
  });

  it("boundary: revealing pitch 3 leaves two arcane damage unprevented", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      {
        hero: dash,
        hand: [eirinasPrayerRed],
        resourcePoints: 1,
        life: 20,
        deck: 6,
        deckTop: [nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(volticBoltRed, { target: Dash.id });
    Blaze.pass();
    Dash.play(eirinasPrayerRed);
    game.passBoth();
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(18);
  });

  it("timing: the prevention expires at the end of the turn", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [volticBoltRed, nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      {
        hero: dash,
        hand: [eirinasPrayerRed],
        resourcePoints: 1,
        life: 20,
        deck: 6,
        deckTop: [snatchRed],
      },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.pass();
    Dash.play(eirinasPrayerRed);
    game.passBoth();
    Blaze.endTurn();
    Dash.endTurn();
    Blaze.play(volticBoltRed, { pitch: nimblismBlue, target: Dash.id });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(15);
  });
});
