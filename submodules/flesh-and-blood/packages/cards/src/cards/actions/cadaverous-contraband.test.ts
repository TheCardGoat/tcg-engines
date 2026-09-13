import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { cadaverousContrabandRed } from "./cadaverous-contraband.ts";

describe("Cadaverous Contraband family AAA", () => {
  it("happy: a hit may recycle a non-attack action", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [cadaverousContrabandRed],
        graveyard: [nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    Bravo.playAttack(cadaverousContrabandRed);
    game.closeCombat({ optionals: "accept" });
    expectFabPlayer(game.as(dash)).toHaveLife(14);
    expect(Bravo.zone("deck")).toContain(nimblismBlue.canonicalId);
    expect(Bravo.zone("graveyard")).not.toContain(nimblismBlue.canonicalId);
  });
  it("boundary: an attack action cannot be recycled", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [cadaverousContrabandRed],
        graveyard: [snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    Bravo.playAttack(cadaverousContrabandRed);
    game.closeCombat({ optionals: "decline" });
    expectFabCard(Bravo, snatchRed).toBeIn("graveyard");
  });
  it("timing: declining optional leaves a valid card in graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [cadaverousContrabandRed],
        graveyard: [nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    Bravo.playAttack(cadaverousContrabandRed);
    game.closeCombat({ optionals: "decline" });
    expectFabCard(Bravo, nimblismBlue).toBeIn("graveyard");
  });
});
