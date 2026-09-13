import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { blessingOfPatienceRed } from "./blessing-of-patience.ts";

describe("Blessing of Patience (DYN033) AAA", () => {
  it("happy: start of your turn destroys this then a targeted hero gains 3{h}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 20, deck: 6 },
      {
        hero: bravo,
        arena: [blessingOfPatienceRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Dash.endTurn();
    expectWait(game).toHaveDecision("entity-target");
    Bravo.target(Bravo);
    game.untilIdle();

    expectFabCard(Bravo, blessingOfPatienceRed).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveLife(23);
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("boundary: the targeted opponent can be the life gainer", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 20, deck: 6 },
      {
        hero: bravo,
        arena: [blessingOfPatienceRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Dash.endTurn();
    Bravo.target(Dash);
    game.untilIdle();

    expectFabPlayer(Dash).toHaveLife(23);
    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("timing: does not fire at the start of the opponent's turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [blessingOfPatienceRed], life: 20, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).endTurn();
    game.untilIdle();
    expectFabCard(game.as(bravo), blessingOfPatienceRed).toBeIn("arena");
    expectFabPlayer(game.as(bravo)).toHaveLife(20);
    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });
});
