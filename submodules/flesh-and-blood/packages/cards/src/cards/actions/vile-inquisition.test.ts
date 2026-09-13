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
 * Life loss is authored against `attack-target` on a non-attack. Pin current
 * resolution: the chosen top card is banished and the hero does not lose life.
 */

describe("Vile Inquisition (DTD178) AAA", () => {
  it("happy: a red top card is not banished and they do not lose 1{h} (attack-target gap)", () => {
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

    const topId = Dash.zone("deck")[Dash.zone("deck").length - 1]!;
    Chane.play(vileInquisitionRed, { targetInstanceId: topId });
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "maximum" });

    expect(Dash.zone("deck")).toContain(snatchRed.canonicalId);
    expect(Dash.zone("banished")).not.toContain(snatchRed.canonicalId);
    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Chane, vileInquisitionRed).toBeIn("graveyard");
  });

  it("boundary: a non-red top card stays in the deck and they lose no life", () => {
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

    const topId = Dash.zone("deck")[Dash.zone("deck").length - 1]!;
    Chane.play(vileInquisitionRed, { targetInstanceId: topId });
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "maximum" });

    expect(Dash.zone("deck")).toContain(nimblismBlue.canonicalId);
    expectFabPlayer(Dash).toHaveLife(20);
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

    const topId = Dash.zone("deck")[Dash.zone("deck").length - 1]!;
    Chane.play(vileInquisitionRed, { from: "banished", targetInstanceId: topId });
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "maximum" });
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
