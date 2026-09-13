import { describe, expect, it } from "vitest";
import { FAB_MANUAL_HARNESS, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { cindra } from "../heroes/cindra.ts";
import { huntToTheEndsOfRatheRed } from "./hunt-to-the-ends-of-rathe.ts";
import { lavaBurstRed } from "./lava-burst.ts";

describe("Lava Burst (DRO010) AAA", () => {
  it("happy: as chain link 4 or higher this has +3{p} (Rupture)", () => {
    const game = FabTestEngine.start(
      {
        hero: cindra,
        hand: [
          huntToTheEndsOfRatheRed,
          huntToTheEndsOfRatheRed,
          huntToTheEndsOfRatheRed,
          lavaBurstRed,
        ],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Cindra = game.as(cindra);

    Cindra.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    Cindra.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    Cindra.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    Cindra.attackWith(lavaBurstRed);

    expect(game.combat()?.activeLink?.attackPower).toBe(5);
  });

  it("boundary: as chain link 1 this stays at printed 2{p}", () => {
    const game = FabTestEngine.start(
      { hero: cindra, hand: [lavaBurstRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(cindra).attackWith(lavaBurstRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(2);
  });
});
