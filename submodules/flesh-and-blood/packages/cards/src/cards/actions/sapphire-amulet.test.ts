import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { sapphireAmuletBlue } from "./sapphire-amulet.ts";

describe("Sapphire Amulet (SEA197) AAA", () => {
  it("happy: destroy this to get +1{i} this turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [sapphireAmuletBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expect(Bravo.intellect()).toBe(4);
    Bravo.activate(sapphireAmuletBlue);
    game.passBoth();
    expect(Bravo.intellect()).toBe(5);
    expectFabCard(Bravo, sapphireAmuletBlue).toBeIn("graveyard");
  });

  it("boundary: the opponent's intellect is unchanged", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [sapphireAmuletBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).activate(sapphireAmuletBlue);
    game.passBoth();
    expect(Dash.intellect()).toBe(4);
  });

  it("timing: +1{i} expires after the turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [sapphireAmuletBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(sapphireAmuletBlue);
    game.passBoth();
    expect(Bravo.intellect()).toBe(5);
    Bravo.endTurn();
    Dash.endTurn();
    expect(Bravo.intellect()).toBe(4);
  });
});
