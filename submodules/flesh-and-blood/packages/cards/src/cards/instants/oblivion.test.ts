import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { runechant } from "../tokens/runechant.ts";
import { vynnset } from "../heroes/vynnset.ts";
import { nasrethTheSoulHarrower } from "../tokens/nasreth-the-soul-harrower.ts";
import { oblivionBlue } from "./oblivion.ts";

const sixRunechants = [runechant, runechant, runechant, runechant, runechant, runechant];

describe("Oblivion (DTD142) AAA", () => {
  it("happy: with exactly 6 Runechants, creates Nasreth, the Soul Harrower", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [oblivionBlue],
        arena: sixRunechants,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.play(oblivionBlue);
    game.passBoth();

    expect(
      Vynnset.zone("arena").some(
        (id) =>
          id === nasrethTheSoulHarrower.canonicalId || id.includes("nasreth-the-soul-harrower"),
      ),
    ).toBe(true);
    expectFabCard(Vynnset, oblivionBlue).toBeIn("graveyard");
    expect(Vynnset.zone("arena").filter((id) => id === runechant.canonicalId)).toHaveLength(6);
    expectFabPlayer(Vynnset).toHaveAP(1);
  });

  it("boundary: cannot play without exactly 6 Runechants", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [oblivionBlue],
        arena: [runechant, runechant, runechant, runechant, runechant],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    expect(() => Vynnset.play(oblivionBlue)).toThrow();
    expect(Vynnset.zone("arena")).not.toContain(nasrethTheSoulHarrower.canonicalId);
    expectFabCard(Vynnset, oblivionBlue).toBeIn("hand");
  });
});
