import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimbleStrikeRed } from "./nimble-strike.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { talismanOfRecompenseYellow } from "./talisman-of-recompense.ts";

describe("Talisman of Recompense (EVR191) AAA", () => {
  it("happy: pitching exactly 1{r} destroys this and yields 3{r} before the spend", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [talismanOfRecompenseYellow],
        hand: [nimbleStrikeRed, snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(nimbleStrikeRed, { pitch: snatchRed });
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, talismanOfRecompenseYellow).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveResourceCount(2);
  });

  it("boundary: pitching a blue (3{r}) does not destroy this", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [talismanOfRecompenseYellow],
        hand: [nimbleStrikeRed, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(nimbleStrikeRed, { pitch: nimblismBlue });
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, talismanOfRecompenseYellow).toBeIn("arena");
    expectFabPlayer(Bravo).toHaveResourceCount(2);
  });

  it("timing: a second exact-1{r} pitch after destroy is unreplaced", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [talismanOfRecompenseYellow],
        hand: [nimbleStrikeRed, snatchRed, nimbleStrikeRed, snatchRed],
        resourcePoints: 0,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(nimbleStrikeRed, { pitch: snatchRed });
    game.helpers.resolveUntilIdle();
    expectFabCard(Bravo, talismanOfRecompenseYellow).toBeIn("graveyard");

    Bravo.play(nimbleStrikeRed, { pitch: snatchRed });
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, talismanOfRecompenseYellow).toBeIn("graveyard");
  });
});
