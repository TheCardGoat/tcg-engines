import { describe, expect, it } from "vitest";
import { FAB_MANUAL_HARNESS, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { ravenousRabbleRed } from "./ravenous-rabble.ts";
import { nimblismBlue } from "./nimblism.ts";
import { pushThePointRed } from "./push-the-point.ts";

describe("Push the Point (ARC188) AAA", () => {
  it("happy: +2{p} when the last attack on this combat chain hit", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [ravenousRabbleRed, pushThePointRed],
        deck: [nimblismBlue],
        actionPoints: 1,
        resourcePoints: 1,
      },
      { hero: briar, deck: 6, life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.play(ravenousRabbleRed, { target: game.as(briar).id });
    game.passBoth();
    game.advanceCombatTo("resolution");
    Dash.play(pushThePointRed, { target: game.as(briar).id });
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
  });

  it("boundary: printed 4{p} when this is the first chain link", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [pushThePointRed],
        actionPoints: 1,
        resourcePoints: 1,
      },
      { hero: briar, deck: 6, life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.play(pushThePointRed, { target: game.as(briar).id });
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });
});
