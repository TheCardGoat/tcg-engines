import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { dash } from "../heroes/dash.ts";
import { turnToMindfireRed } from "./turn-to-mindfire.ts";

describe("Turn to Mindfire (OMN136) AAA", () => {
  it("happy: deals 5 arcane, tapping the hero creates a Ponder token", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [turnToMindfireRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.play(turnToMindfireRed, { target: game.as(dash).id });
    game.passBoth();
    if (game.pendingDecision()?.kind === "boolean") Blaze.chooseBoolean(true);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expectFabPlayer(game.as(dash)).toHaveLife(15);
    expect(Blaze.zone("arena")).toContain("token:ponder");
    expectFabCard(Blaze, blazeFiremind).toBeTapped();
    expectFabCard(Blaze, turnToMindfireRed).toBeIn("graveyard");
  });

  it("boundary: declining the tap does not create a Ponder token", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [turnToMindfireRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.play(turnToMindfireRed, { target: game.as(dash).id });
    game.passBoth();
    if (game.pendingDecision()?.kind === "boolean") Blaze.chooseBoolean(false);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(game.as(dash)).toHaveLife(15);
    expect(Blaze.zone("arena")).not.toContain("token:ponder");
    expectFabCard(Blaze, blazeFiremind).toBeReady();
  });
});
