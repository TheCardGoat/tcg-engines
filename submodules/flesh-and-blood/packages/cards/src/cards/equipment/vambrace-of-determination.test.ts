import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { blessingOfSerenityRed } from "../instants/blessing-of-serenity.ts";
import { snatchRed } from "../actions/snatch.ts";
import { vambraceOfDetermination } from "./vambrace-of-determination.ts";

describe("Vambrace of Determination (OUT174) AAA", () => {
  it("happy: defend and pay {r} → +1{d} and blade break", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        arms: [vambraceOfDetermination],
        resourcePoints: 1,
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(vambraceOfDetermination);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabPlayer(Dash).toHaveResourceCount(0);
    expectFabCard(Dash, vambraceOfDetermination).toBeIn("graveyard");
  });

  it("boundary: declining the pay leaves d0 and does not grant blade break", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        arms: [vambraceOfDetermination],
        resourcePoints: 1,
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(vambraceOfDetermination);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabPlayer(Dash).toHaveResourceCount(1);
    expectFabCard(Dash, vambraceOfDetermination).toBeIn("arms");
  });

  it("timing: Attack Reaction makes the next physical prevention prevent 1 less", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [vambraceOfDetermination],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [blessingOfSerenityRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Bravo.activate(vambraceOfDetermination);
    game.passBoth();
    Bravo.pass();
    Dash.play(blessingOfSerenityRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveResourceCount(0);
    expectFabPlayer(Dash).toHaveLife(18);
    expectFabCard(Bravo, vambraceOfDetermination).toBeIn("arms");
  });
});
