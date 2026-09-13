import { describe, it } from "vitest";
import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { chane } from "../heroes/chane.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { damTheShadowakeRed } from "./dam-the-shadowake.ts";

describe("Dam the Shadowake AAA", () => {
  it("happy: defending a Shadow hero's attack creates a Gate to i'Arathael", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [damTheShadowakeRed],
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: chane },
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.playAttack(snatchRed);
    Dash.defendWith(damTheShadowakeRed);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Dash).toHaveTokenCount("gate-to-i-arathael", 1);
  });

  it("boundary: defending a non-Shadow hero's attack does not create a Gate", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: chane,
        hand: [damTheShadowakeRed],
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Chane = game.as(chane);

    Dash.playAttack(snatchRed);
    Chane.defendWith(damTheShadowakeRed);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Chane).toHaveTokenCount("gate-to-i-arathael", 0);
  });
});
