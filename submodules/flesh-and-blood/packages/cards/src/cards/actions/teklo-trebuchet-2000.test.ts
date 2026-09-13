import { describe, expect, it } from "vitest";
import { FAB_MANUAL_HARNESS, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { teklovossen } from "../heroes/teklovossen.ts";
import { dash } from "../heroes/dash.ts";
import { grindingGearsBlue } from "./grinding-gears.ts";
import { zeroToSixtyRed } from "./zero-to-sixty.ts";
import { tekloTrebuchet2000Blue } from "./teklo-trebuchet-2000.ts";

describe("Teklo Trebuchet 2000 (PEN066) AAA", () => {
  it("happy: the next attack boosted this combat chain gets +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [tekloTrebuchet2000Blue, zeroToSixtyRed],
        deck: [grindingGearsBlue, grindingGearsBlue],
        actionPoints: 1,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.attackWith(tekloTrebuchet2000Blue, { boost: true });
    game.advanceCombatTo("resolution");
    Teklo.attackWith(zeroToSixtyRed, { boost: true });

    expect(game.combat()?.activeLink?.attackPower).toBe(6);
  });

  it("boundary: a follow-up attack that is not boosted does not get +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [tekloTrebuchet2000Blue, zeroToSixtyRed],
        deck: [grindingGearsBlue, grindingGearsBlue],
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.attackWith(tekloTrebuchet2000Blue, { boost: true });
    game.advanceCombatTo("resolution");
    Teklo.attackWith(zeroToSixtyRed);

    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });
});
