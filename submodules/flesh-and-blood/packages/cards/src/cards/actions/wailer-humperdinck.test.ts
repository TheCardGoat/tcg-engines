import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { dash } from "../heroes/dash.ts";
import { wailerHumperdinckYellow } from "./wailer-humperdinck.ts";

describe("Wailer Humperdinck (SEA052) AAA", () => {
  it("happy: resolves into the arena as an ally with Watery Grave", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [wailerHumperdinckYellow],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(wailerHumperdinckYellow);
    game.helpers.resolveUntilIdle();

    expectFabCard(Gravy, wailerHumperdinckYellow).toBeIn("arena");
    expectFabCard(Gravy, wailerHumperdinckYellow).toHaveKeyword("watery-grave");
  });

  it("boundary: without 6 resources it cannot be played", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [wailerHumperdinckYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    expect(() => Gravy.play(wailerHumperdinckYellow)).toThrow();
    expectFabCard(Gravy, wailerHumperdinckYellow).toBeIn("hand");
  });

  it("timing: Action — {r}{r}{r}{r}{r}{r}, {t}: Attack hits for printed 11", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [wailerHumperdinckYellow],
        resourcePoints: 12,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(wailerHumperdinckYellow);
    game.helpers.resolveUntilIdle();
    Gravy.activate(wailerHumperdinckYellow);
    game.passBoth();

    expect(game.combat()?.activeLink?.attackPower).toBe(11);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(9);
  });
});
