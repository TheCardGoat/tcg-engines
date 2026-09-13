import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { pulsingAetherLifeRed } from "./pulsing-aether-life.ts";

/**
 * Pulsing Aether // Life (ROS018) — Wizard Action // Earth Instant.
 * Pulsing Aether: 4 arcane. Life: gain 1{h}. Meld: passBoth between faces.
 */

describe("Pulsing Aether // Life (ROS018) AAA", () => {
  it("happy: melded Life then Pulsing Aether gains 1{h} and deals 4", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [pulsingAetherLifeRed],
        resourcePoints: 6,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(pulsingAetherLifeRed, {
      playMethod: { kind: "meld" },
      targetInstanceId: Dash.ref(dash).instanceId,
    });
    game.passBoth();
    game.passBoth();

    expectFabPlayer(Blaze).toHaveLife(21);
    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Blaze, pulsingAetherLifeRed).toBeIn("graveyard");
  });

  it("boundary: unpayable cost keeps the card in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [pulsingAetherLifeRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    expectFabUnplayable(() =>
      Blaze.play(pulsingAetherLifeRed, {
        playMethod: { kind: "meld" },
        targetInstanceId: Dash.ref(dash).instanceId,
      }),
    );
    expectFabCard(Blaze, pulsingAetherLifeRed).toBeIn("hand");
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("timing: left-face Pulsing Aether alone deals 4 with no life gain", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [pulsingAetherLifeRed],
        resourcePoints: 6,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(pulsingAetherLifeRed, {
      playMethod: { kind: "face", face: "left" },
      targetInstanceId: Dash.ref(dash).instanceId,
    });
    game.passBoth();

    expectFabPlayer(Blaze).toHaveLife(20);
    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Blaze, pulsingAetherLifeRed).toBeIn("graveyard");
  });
});
