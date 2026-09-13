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
import { cometStormShockRed } from "./comet-storm-shock.ts";

/**
 * Comet Storm // Shock (OSC013) — Wizard Action // Lightning Instant.
 * Shock: 1 arcane. Comet Storm: 5 arcane. Meld: passBoth between faces.
 */

describe("Comet Storm // Shock (OSC013) AAA", () => {
  it("happy: melded Shock then Comet Storm deals 1 then 5", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [cometStormShockRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(cometStormShockRed, {
      playMethod: { kind: "meld" },
      targetInstanceId: Dash.ref(dash).instanceId,
    });
    game.passBoth();
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(14);
    expectFabCard(Blaze, cometStormShockRed).toBeIn("graveyard");
  });

  it("boundary: unpayable cost keeps the card in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [cometStormShockRed],
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
      Blaze.play(cometStormShockRed, {
        playMethod: { kind: "meld" },
        targetInstanceId: Dash.ref(dash).instanceId,
      }),
    );
    expectFabCard(Blaze, cometStormShockRed).toBeIn("hand");
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("timing: left-face Comet Storm alone deals 5 and goes to GY", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [cometStormShockRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(cometStormShockRed, {
      playMethod: { kind: "face", face: "left" },
      targetInstanceId: Dash.ref(dash).instanceId,
    });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabCard(Blaze, cometStormShockRed).toBeIn("graveyard");
  });
});
