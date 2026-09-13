import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { steelbraidBuckler } from "../equipment/steelbraid-buckler.ts";
import { shieldWallRed } from "./shield-wall.ts";

describe("Shield Wall family AAA", () => {
  it("gets +4{d} while a Guardian off-hand is controlled", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        hand: [shieldWallRed],
        weapon2: [steelbraidBuckler],
        resourcePoints: 6,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    game.as(dash).attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    game.as(dash).pass();
    Bravo.play(shieldWallRed);
    game.passBoth();
    expectFabCard(Bravo, shieldWallRed).toHaveDefense(11);
  });
});
