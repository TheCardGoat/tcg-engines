import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { boltyn } from "../heroes/boltyn.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { risingSolartideRed } from "./rising-solartide.ts";

describe("Rising Solartide (BOL025) AAA", () => {
  it("happy: a hit puts this into your hero's soul", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [risingSolartideRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.playAttack(risingSolartideRed);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(15);
    expectFabCard(Boltyn, risingSolartideRed).toBeIn("soul");
  });

  it("boundary: a miss leaves this in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [risingSolartideRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [brutalAssaultBlue, brutalAssaultBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    Boltyn.playAttack(risingSolartideRed);
    Dash.defendWith(brutalAssaultBlue, brutalAssaultBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Boltyn, risingSolartideRed).toBeIn("graveyard");
  });
});
