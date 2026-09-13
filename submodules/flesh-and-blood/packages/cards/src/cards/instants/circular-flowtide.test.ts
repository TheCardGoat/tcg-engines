import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { zyggyStarlight } from "../heroes/zyggy-starlight.ts";
import { circularFlowtideYellow } from "./circular-flowtide.ts";

describe("Circular Flowtide (AZS018) AAA", () => {
  it("happy: leave-arena from Ward creates a Lightning Flow token", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: zyggyStarlight,
        arena: [circularFlowtideYellow],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    game.as(dash).attackWith(snatchRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expectFabCard(Zyggy, circularFlowtideYellow).toBeIn("graveyard");
    expectFabPlayer(Zyggy).toHaveTokenCount("lightning-flow", 1);
  });

  it("boundary: the opponent's leave-arena does not mint Lightning Flow for you", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: zyggyStarlight,
        arena: [circularFlowtideYellow],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );

    game.as(dash).attackWith(snatchRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expectFabPlayer(game.as(dash)).toHaveTokenCount("lightning-flow", 0);
  });

  it("timing: entering the arena does not create Lightning Flow", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [circularFlowtideYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.play(circularFlowtideYellow);
    game.passBoth();

    expectFabCard(Zyggy, circularFlowtideYellow).toBeIn("arena");
    expectFabPlayer(Zyggy).toHaveTokenCount("lightning-flow", 0);
  });
});
