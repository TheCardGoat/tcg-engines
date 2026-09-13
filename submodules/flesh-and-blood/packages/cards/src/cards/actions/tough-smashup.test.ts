import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { tuffnut } from "../heroes/tuffnut.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { commandAndConquerRed } from "./command-and-conquer.ts";
import { nimblismBlue } from "./nimblism.ts";
import { toughSmashupRed } from "./tough-smashup.ts";

describe("Tough Smashup family AAA", () => {
  it("happy: defending and winning the clash creates a Toughness token", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      {
        hero: tuffnut,
        hand: [toughSmashupRed],
        deck: [commandAndConquerRed],
      },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    game.as(dash).attackWith(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    Tuffnut.defendWith(toughSmashupRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(Tuffnut.zone("arena")).toContain("token:toughness");
    expect(game.as(dash).zone("arena")).not.toContain("token:toughness");
  });

  it("boundary: losing the clash gives the attacking hero the Toughness token", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [commandAndConquerRed],
      },
      {
        hero: tuffnut,
        hand: [toughSmashupRed],
        deck: [nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    game.as(dash).attackWith(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    Tuffnut.defendWith(toughSmashupRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(game.as(dash).zone("arena")).toContain("token:toughness");
    expect(Tuffnut.zone("arena")).not.toContain("token:toughness");
    expectFabCard(Tuffnut, toughSmashupRed).toBeIn("graveyard");
  });
});
