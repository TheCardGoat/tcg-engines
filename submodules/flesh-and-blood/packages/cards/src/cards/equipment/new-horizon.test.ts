import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { newHorizon } from "./new-horizon.ts";

/**
 * New Horizon — Ranger Head d2 Blade Break.
 *
 * Printed: "If you have a face up card in your arsenal, you have an additional
 * arsenal zone. / When this is destroyed, destroy all cards in your arsenal.
 * Blade Break"
 */

describe("New Horizon AAA", () => {
  it("happy: a face-up arsenal card grants a second arsenal slot at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        head: [newHorizon],
        arsenal: [{ card: snatchRed, state: { faceDown: false } }],
        hand: [nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    const nimblismId = Azalea.findCardInZone("hand", nimblismBlue);
    Azalea.endTurn({ arsenalInstanceId: nimblismId });

    expectFabCard(Azalea, Azalea.cardIn("arsenal", snatchRed)).toBeIn("arsenal");
    expectFabCard(Azalea, Azalea.cardIn("arsenal", nimblismBlue)).toBeIn("arsenal");
  });

  it("boundary: a face-down arsenal card grants nothing — a second placement is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        head: [newHorizon],
        arsenal: [{ card: snatchRed, state: { faceDown: true } }],
        hand: [nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    const nimblismId = Azalea.findCardInZone("hand", nimblismBlue);
    expectFabUnplayable(() => Azalea.endTurn({ arsenalInstanceId: nimblismId }), /arsenal/i);
    expectFabCard(Azalea, Azalea.cardIn("arsenal", snatchRed)).toBeIn("arsenal");
  });

  it("destroy clause: blade-breaking New Horizon takes the whole arsenal with it", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultBlue], actionPoints: 1, deck: 6 },
      {
        hero: azalea,
        head: [newHorizon],
        arsenal: [nimblismBlue],
        hand: [],
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Dash.playAttack(brutalAssaultBlue);
    Azalea.defendWith(newHorizon);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Azalea, newHorizon).toBeIn("graveyard");
    expectFabCard(Azalea, Azalea.cardIn("graveyard", nimblismBlue)).toBeIn("graveyard");
    expect(Azalea.zone("arsenal")).toHaveLength(0);
  });
});
