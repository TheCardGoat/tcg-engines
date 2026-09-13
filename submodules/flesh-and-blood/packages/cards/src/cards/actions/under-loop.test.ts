import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { underLoopRed } from "./under-loop.ts";

describe("Under Loop (TCC016) AAA", () => {
  it("happy: a hit puts this on the bottom of its owner's deck", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [underLoopRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: azalea, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(underLoopRed);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(game.as(azalea)).toHaveLife(16);
    expect(Dash.cardsIn("deck", underLoopRed).length).toBe(1);
    expect(Dash.zone("deck")[0]).toBe(underLoopRed.canonicalId);
  });

  it("boundary: a miss leaves this in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [underLoopRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: azalea,
        hand: [brutalAssaultBlue, brutalAssaultBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Azalea = game.as(azalea);

    Dash.playAttack(underLoopRed);
    Azalea.defendWith(brutalAssaultBlue, brutalAssaultBlue);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Azalea).toHaveLife(20);
    expectFabCard(Dash, underLoopRed).toBeIn("graveyard");
    expect(Dash.cardsIn("deck", underLoopRed).length).toBe(0);
  });
});
