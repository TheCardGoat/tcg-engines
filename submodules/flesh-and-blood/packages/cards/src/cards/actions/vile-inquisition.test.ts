import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { chane } from "../heroes/chane.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { vileInquisitionRed } from "./vile-inquisition.ts";

/**
 * Vile Inquisition (DTD178) — Shadow Action, cost 2, 3{d}, Blood Debt.
 *
 * Printed: "You may play this from your banished zone. If you do, it costs
 * {r}{r} less to play.\nTarget hero banishes the top card of their deck. If
 * it's red, they lose 1{h}.\nBlood Debt"
 *
 * The target hero is declared when the card is played (CR 1.8.5); the deck
 * top is banished unconditionally and "they lose 1{h}" resolves against the
 * declared hero when the banished card matches the color.
 */

describe("Vile Inquisition (DTD178) AAA", () => {
  it("happy: the target hero banishes their red top card and loses 1{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [vileInquisitionRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deckTop: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.play(vileInquisitionRed, { target: Dash.id });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(Dash.zone("deck")).not.toContain(snatchRed.canonicalId);
    expect(Dash.zone("banished")).toContain(snatchRed.canonicalId);
    expectFabPlayer(Dash).toHaveLife(19);
    expectFabCard(Chane, vileInquisitionRed).toBeIn("graveyard");
  });

  it("boundary: a non-red top card is banished without life loss", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [vileInquisitionRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deckTop: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.play(vileInquisitionRed, { target: Dash.id });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(Dash.zone("deck")).not.toContain(nimblismBlue.canonicalId);
    expect(Dash.zone("banished")).toContain(nimblismBlue.canonicalId);
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("target: you may declare your own hero and banish your own deck top", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [vileInquisitionRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deckTop: [snatchRed],
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(vileInquisitionRed, { target: Chane.id });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(Chane.zone("banished")).toContain(snatchRed.canonicalId);
    expectFabPlayer(Chane).toHaveLife(19);
  });

  it("timing: you may play this from banished for {r}{r} less; Blood Debt ticks at end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        banished: [vileInquisitionRed],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deckTop: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.play(vileInquisitionRed, { from: "banished", target: Dash.id });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expect(Dash.zone("banished")).toContain(nimblismBlue.canonicalId);
    expectFabCard(Chane, vileInquisitionRed).toBeIn("graveyard");

    const unpaid = FabTestEngine.start(
      {
        hero: chane,
        hand: [],
        banished: [vileInquisitionRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    unpaid.as(chane).endTurn();
    unpaid.helpers.untilIdle();
    expectFabPlayer(unpaid.as(chane)).toHaveLife(19);
  });
});
