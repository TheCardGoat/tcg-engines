import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { limpitHopALongYellow } from "../actions/limpit-hop-a-long.ts";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { markOfUsheringBlue } from "./mark-of-ushering.ts";

describe("Mark of Ushering (IAR068) AAA", () => {
  it("happy: binds to an Ally and grants +1 power", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [markOfUsheringBlue], arena: [limpitHopALongYellow], deck: 6 },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.play(markOfUsheringBlue, {
      targetInstanceId: Dash.cardIn("arena", limpitHopALongYellow).instanceId,
    });
    game.untilIdle();
    expectFabCard(Dash, markOfUsheringBlue).toBeUnder(limpitHopALongYellow);
    expectFabCard(Dash, limpitHopALongYellow).toHavePower(3);
  });
  it("boundary: cannot be played without an Ally you control", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [markOfUsheringBlue], deck: 6 },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    expectFabUnplayable(() => game.as(dash).play(markOfUsheringBlue));
  });
  it("rider: a bound Ally hit creates a Gate to i'Arathael", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [markOfUsheringBlue],
        arena: [limpitHopALongYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.play(markOfUsheringBlue, {
      targetInstanceId: Dash.cardIn("arena", limpitHopALongYellow).instanceId,
    });
    game.untilIdle();
    Dash.activateAttack(limpitHopALongYellow);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dash).toHaveTokenCount("gate-to-i-arathael", 1);
  });
});
