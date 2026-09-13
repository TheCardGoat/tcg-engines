import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { genisWotchuneed } from "../heroes/genis-wotchuneed.ts";
import { magrar } from "./magrar.ts";

/**
 * Magrar (JDG038) — Merchant Off-Hand, Genis Specialization.
 *
 * Printed: Action - Destroy this: Create a Zen State and an Inertia token.
 */

describe("Magrar (JDG038) AAA", () => {
  it("happy: destroying this creates a Zen State and an Inertia token", () => {
    const game = FabTestEngine.start(
      {
        hero: genisWotchuneed,
        weapon2: [magrar],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Genis = game.as(genisWotchuneed);

    Genis.activate(magrar);
    game.passBoth();
    expectFabCard(Genis, magrar).toBeIn("graveyard");
    expectFabPlayer(Genis).toHaveTokenCount("zen-state", 1).toHaveTokenCount("inertia", 1);
  });

  it("boundary: the Action is illegal with 0 action points", () => {
    const game = FabTestEngine.start(
      {
        hero: genisWotchuneed,
        weapon2: [magrar],
        hand: [],
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Genis = game.as(genisWotchuneed);

    Genis.expectActivationRejected(magrar);
    expectFabCard(Genis, magrar).toBeIn("weapon2");
    expectFabPlayer(Genis).toHaveTokenCount("zen-state", 0).toHaveTokenCount("inertia", 0);
  });

  it("timing: Action spends an action point (no go again)", () => {
    const game = FabTestEngine.start(
      {
        hero: genisWotchuneed,
        weapon2: [magrar],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Genis = game.as(genisWotchuneed);

    Genis.activate(magrar);
    game.passBoth();
    expectFabCard(Genis, magrar).toBeIn("graveyard");
    expectFabPlayer(Genis).toHaveAP(0);
  });
});
