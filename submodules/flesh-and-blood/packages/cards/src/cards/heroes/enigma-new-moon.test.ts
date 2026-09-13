import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { meridianPathway } from "../equipment/meridian-pathway.ts";
import { snapdragonScalers } from "../equipment/snapdragon-scalers.ts";
import { enigmaNewMoon } from "./enigma-new-moon.ts";

/**
 * Enigma, New Moon (MST238) — Mystic Illusionist Hero Young 20hp.
 *
 * Printed Instant: {c}{c}{c}: Turn target face-down equipment you have equipped
 * face-up. If it has ward, create 3 Spectral Shield tokens.
 */

describe("Enigma, New Moon (MST238) AAA", () => {
  it("happy: turn face-up ward equipment and mint 3 Spectral Shields", () => {
    const game = FabTestEngine.start(
      {
        hero: enigmaNewMoon,
        head: [{ card: meridianPathway, state: { faceDown: true } }],
        chiPoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigmaNewMoon);

    Enigma.activate(enigmaNewMoon);
    game.untilIdle({ entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Enigma, meridianPathway).toBeFaceUp();
    expectFabPlayer(Enigma).toHaveTokenCount("spectral-shield", 3);
  });

  it("boundary: face-up non-ward equipment does not mint Spectral Shields", () => {
    const game = FabTestEngine.start(
      {
        hero: enigmaNewMoon,
        legs: [{ card: snapdragonScalers, state: { faceDown: true } }],
        chiPoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigmaNewMoon);

    Enigma.activate(enigmaNewMoon);
    game.untilIdle({ entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Enigma, snapdragonScalers).toBeFaceUp();
    expectFabPlayer(Enigma).toHaveTokenCount("spectral-shield", 0);
  });

  it("boundary: unpayable {c}{c}{c} is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: enigmaNewMoon,
        head: [{ card: meridianPathway, state: { faceDown: true } }],
        chiPoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(enigmaNewMoon).expectActivationRejected(enigmaNewMoon);
    expectFabPlayer(game.as(enigmaNewMoon)).toHaveLife(20);
  });
});
