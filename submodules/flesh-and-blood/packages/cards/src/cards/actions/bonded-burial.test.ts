import { describe, it } from "vitest";
import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { malice } from "../heroes/malice.ts";
import { bondedBurialRed } from "./bonded-burial.ts";
import { nimblismBlue } from "./nimblism.ts";
import { restlessClericRed } from "./restless-cleric.ts";

describe("Bonded Burial AAA", () => {
  it("happy: discarding an ally after hitting a hero makes them discard", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        hand: [bondedBurialRed, restlessClericRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);
    const Dash = game.as(dash);

    Malice.playAttack(bondedBurialRed);
    Dash.defendWith();
    game.closeCombat({ optionals: "accept", entityTargets: "maximum" });

    expectFabCard(Malice, restlessClericRed).toBeIn("graveyard");
    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(15);
  });

  it("happy: destroying a controlled ally after hitting a hero makes them discard", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        hand: [bondedBurialRed],
        arena: [restlessClericRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);
    const Dash = game.as(dash);

    Malice.playAttack(bondedBurialRed);
    Dash.defendWith();
    game.closeCombat({ optionals: "accept", entityTargets: "maximum" });

    expectFabCard(Malice, restlessClericRed).toBeBanished();
    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
  });

  it("boundary: declining the optional keeps their hand", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        hand: [bondedBurialRed, restlessClericRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);
    const Dash = game.as(dash);

    Malice.playAttack(bondedBurialRed);
    Dash.defendWith();
    game.closeCombat({ optionals: "decline" });

    expectFabCard(Malice, restlessClericRed).toBeIn("hand");
    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
  });
});
