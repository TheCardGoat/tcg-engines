import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { stormOfSandikai } from "../weapons/storm-of-sandikai.ts";
import { dromaiAshArtist } from "../heroes/dromai-ash-artist.ts";
import { woundingBlowBlue } from "../actions/wounding-blow.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nekria } from "./nekria.ts";

/**
 * Nekria (UPR013) — Draconic Illusionist Dragon Ally, 4{p}/7{h}.
 *
 * Printed: Whenever Nekria deals or is dealt damage, put a -1{h} counter on
 * her and create an Ash token.
 */

describe("Nekria (UPR013) AAA", () => {
  it("happy: when Nekria deals damage, put a -1{h} counter on her and create Ash", () => {
    const game = FabTestEngine.start(
      {
        hero: dromaiAshArtist,
        weapon1: [stormOfSandikai],
        arena: [nekria],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromaiAshArtist);
    const Dash = game.as(dash);

    Dromai.activate(nekria);
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Dromai, nekria).toHaveCounters(1);
    expectFabPlayer(Dromai).toHaveTokenCount("ash", 1);
  });

  it("boundary: damage dealt by another source does not put a counter or create Ash", () => {
    const game = FabTestEngine.start(
      {
        hero: dromaiAshArtist,
        arena: [nekria],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromaiAshArtist);
    const Dash = game.as(dash);

    Dromai.playAttack(snatchRed);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Dromai, nekria).toHaveCounters(0);
    expectFabPlayer(Dromai).toHaveTokenCount("ash", 0);
  });

  it("timing: when Nekria is dealt damage, put a -1{h} counter on her and create Ash", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [woundingBlowBlue],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dromaiAshArtist,
        arena: [nekria],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Dromai = game.as(dromaiAshArtist);
    const nekriaId = Dromai.cardIn("arena", nekria).instanceId;

    Dash.attackWith(woundingBlowBlue, { target: nekriaId });
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Dromai, nekria).toBeIn("arena");
    expectFabCard(Dromai, nekria).toHaveCounters(1);
    expectFabPlayer(Dromai).toHaveTokenCount("ash", 1);
  });
});
