import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { chane } from "../heroes/chane.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { painfulPassageRed } from "./painful-passage.ts";

/**
 * Painful Passage Red (SUP269) — Shadow Runeblade Action. Go again.
 *
 * Printed: You may banish an attack action card from your hand. If you do,
 * it gets +3{p} or go again until end of turn.
 *
 * The buffs ride the banished attack action card (bound via outputBinding),
 * so both "or" modes are rule-visible on the next attack made with that
 * card this turn.
 */

describe("Painful Passage (SUP269) AAA", () => {
  it("happy: accepting banishes the chosen attack action from hand", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [painfulPassageRed, brutalAssaultBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(painfulPassageRed);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      effectResolution: "modify-numeric",
    });

    expectFabCard(Chane, brutalAssaultBlue).toBeBanished();
    // The bound banished card itself carries the buff (4 base + 3).
    expectFabCard(Chane, brutalAssaultBlue).toHavePower(7);
    expectFabPlayer(Chane).toHaveHandCount(0);
    expectFabCard(Chane, painfulPassageRed).toBeIn("graveyard");
  });

  it("alternate arm: go again rides the banished card instead", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [painfulPassageRed, brutalAssaultBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(painfulPassageRed);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      effectResolution: "grant-property",
    });

    expectFabCard(Chane, brutalAssaultBlue).toBeBanished();
    expectFabCard(Chane, brutalAssaultBlue).toHaveKeyword("go-again");
    expectFabCard(Chane, painfulPassageRed).toBeIn("graveyard");
  });

  it("boundary: declining keeps the attack action in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [painfulPassageRed, brutalAssaultBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(painfulPassageRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Chane, brutalAssaultBlue).toBeIn("hand");
    expectFabPlayer(Chane).toHaveHandCount(1);
  });
});
