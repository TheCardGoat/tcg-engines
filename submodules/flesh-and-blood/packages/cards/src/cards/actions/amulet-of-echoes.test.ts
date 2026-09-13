import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { amuletOfEchoesBlue } from "./amulet-of-echoes.ts";

describe("Amulet of Echoes (EVR177) AAA", () => {
  it("happy: if they played 2 cards with the same name this turn, they discard 2", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, snatchRed, nimblismBlue, nimblismBlue],
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        arena: [amuletOfEchoesBlue],
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: bravo },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    const snatches = Bravo.cardsIn("hand", snatchRed);
    Bravo.playAttack(snatches[0]!);
    Dash.defendWith();
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    Bravo.playAttack(snatches[1]!);
    Dash.defendWith();
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    Bravo.pass();

    Dash.activate(amuletOfEchoesBlue);
    game.untilIdle({ entityTargets: "pause" });
    const leftovers = Bravo.cardsIn("hand", nimblismBlue);
    Dash.target(leftovers[0]!, leftovers[1]!);
    game.untilIdle();

    expectFabCard(Dash, amuletOfEchoesBlue).toBeIn("graveyard");
    expectFabCard(Bravo, leftovers[0]!).toBeIn("graveyard");
    expectFabCard(Bravo, leftovers[1]!).toBeIn("graveyard");
  });

  it("boundary: cannot activate if they have not played 2 of the same name", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [amuletOfEchoesBlue],
        deck: 6,
      },
      { hero: bravo, hand: [snatchRed, snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.expectActivationRejected(amuletOfEchoesBlue);
    expectFabCard(Dash, amuletOfEchoesBlue).toBeIn("arena");
  });

  it("timing: the Instant cannot activate from hand", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [amuletOfEchoesBlue], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.expectActivationRejected(amuletOfEchoesBlue);
    expectFabCard(Dash, amuletOfEchoesBlue).toBeIn("hand");
  });
});
