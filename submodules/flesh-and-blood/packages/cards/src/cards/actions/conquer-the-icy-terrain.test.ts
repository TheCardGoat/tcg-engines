import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { iyslander } from "../heroes/iyslander.ts";
import { coldSnapRed } from "./cold-snap.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { conquerTheIcyTerrainRed } from "./conquer-the-icy-terrain.ts";

/**
 * Conquer The Icy Terrain, Red (PEN231) — Ice Action - Attack, 7{p}.
 *
 * Printed: When this hits a hero, they may pay {r}{r}. If they don't, you
 * may destroy a frozen card in their arsenal or a frozen non-hero
 * permanent they control.
 */

describe("Conquer The Icy Terrain (PEN231) AAA", () => {
  it("happy: they decline {r}{r} and the frozen arsenal card is destroyed", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [coldSnapRed, conquerTheIcyTerrainRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        arsenal: [snatchRed],
        resourcePoints: 0,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);

    Iyslander.play(coldSnapRed, { target: Dash.id });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabCard(Dash, snatchRed).toBeFrozen();

    Iyslander.playAttack(conquerTheIcyTerrainRed);
    game.closeCombat({
      optionals: "decline",
      entityTargets: "minimum",
      ordering: "listed",
    });

    expectFabCard(Dash, snatchRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(13);
  });

  it("boundary: they pay {r}{r} and the frozen arsenal card survives", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [coldSnapRed, conquerTheIcyTerrainRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        arsenal: [snatchRed],
        resourcePoints: 2,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);

    Iyslander.play(coldSnapRed, { target: Dash.id });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Iyslander.playAttack(conquerTheIcyTerrainRed);
    game.closeCombat({ optionals: "accept", ordering: "listed" });

    expectFabCard(Dash, snatchRed).toBeIn("arsenal");
    expectFabPlayer(Dash).toHaveLife(13);
  });

  it("timing: a fully blocked hit does not destroy the frozen card", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [coldSnapRed, conquerTheIcyTerrainRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        arsenal: [snatchRed],
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        resourcePoints: 0,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);

    Iyslander.play(coldSnapRed, { target: Dash.id });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Iyslander.playAttack(conquerTheIcyTerrainRed);
    Dash.defendWith([nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue]);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dash, snatchRed).toBeIn("arsenal");
    expectFabPlayer(Dash).toHaveLife(20);
  });
});
