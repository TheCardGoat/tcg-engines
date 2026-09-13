import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { boltyn } from "../heroes/boltyn.ts";
import { illuminateRed } from "./illuminate.ts";

describe("Illuminate (MON072) AAA", () => {
  it("happy: a hit puts this into your hero's soul", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [illuminateRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.playAttack(illuminateRed);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabCard(Boltyn, illuminateRed).toBeIn("soul");
  });

  it("boundary: a miss leaves this in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [illuminateRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue, brutalAssaultBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    Boltyn.playAttack(illuminateRed);
    Dash.defendWith(brutalAssaultBlue, brutalAssaultBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Boltyn, illuminateRed).toBeIn("graveyard");
  });
});
