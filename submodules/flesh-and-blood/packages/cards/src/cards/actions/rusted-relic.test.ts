import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { dash } from "../heroes/dash.ts";
import { volticBoltRed } from "./voltic-bolt.ts";
import { rustedRelicBlue } from "./rusted-relic.ts";

describe("Rusted Relic (ARC163) AAA", () => {
  it("happy: plays as an item into the arena", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [rustedRelicBlue], actionPoints: 1, deck: 6 },
      { hero: blazeFiremind, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(rustedRelicBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, rustedRelicBlue).toBeIn("arena");
  });

  it("boundary: declining Arcane Barrier takes the full 5 arcane", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], arena: [rustedRelicBlue], resourcePoints: 1, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(volticBoltRed, { target: Dash.id });
    game.passBoth();
    Dash.expectDecision("option");
    Dash.chooseOptions();

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabPlayer(Dash).toHaveResourceCount(1);
    expectFabCard(Dash, rustedRelicBlue).toBeIn("arena");
  });

  it("timing: paying Arcane Barrier 1 prevents 1 of the 5 arcane", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], arena: [rustedRelicBlue], resourcePoints: 1, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(volticBoltRed, { target: Dash.id });
    game.passBoth();
    const choice = Dash.expectDecision("option");
    Dash.chooseOptions(choice.options[0]!.id);

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabPlayer(Dash).toHaveResourceCount(0);
    expectFabCard(Dash, rustedRelicBlue).toBeIn("arena");
  });
});
