import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { quellingRobe } from "./quelling-robe.ts";

describe("Quelling Robe (UPR184) AAA", () => {
  it("happy: Quell 1 pays {r} to prevent 1 and destroys this at end of turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, chest: [quellingRobe], resourcePoints: 1, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expectFabCard(Dash, quellingRobe).toHaveKeyword("quell");
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveUntilIdle({ optionalOptions: "all" });

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Dash, quellingRobe).toBeIn("chest");
    expectFabPlayer(Dash).toHaveResourceCount(0);

    game.as(bravo).endTurn();
    expectFabCard(Dash, quellingRobe).toBeIn("graveyard");
  });

  it("boundary: without {r} Quell cannot prevent and the robe stays equipped", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, chest: [quellingRobe], resourcePoints: 0, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Dash, quellingRobe).toBeIn("chest");
  });

  it("timing: unused robe stays equipped through the end of turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, chest: [quellingRobe], hand: [], deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, quellingRobe).toBeIn("chest");
  });
});
