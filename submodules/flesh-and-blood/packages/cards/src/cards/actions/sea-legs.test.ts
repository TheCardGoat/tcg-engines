import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { tuffnut } from "../heroes/tuffnut.ts";
import { dash } from "../heroes/dash.ts";
import { wreckerRompRed } from "./wrecker-romp.ts";
import { seaLegsYellow } from "./sea-legs.ts";

describe("Sea Legs (SEA187) AAA", () => {
  it("happy: discarding this as an additional cost creates a Goldkiss Rum", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [wreckerRompRed, seaLegsYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.attackWith(wreckerRompRed);
    expectFabCard(Tuffnut, seaLegsYellow).toBeIn("graveyard");
    expect(Tuffnut.zone("arena")).toContain("token:goldkiss-rum");
  });

  it("boundary: playing this as an attack does not create Goldkiss Rum", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [seaLegsYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.attackWith(seaLegsYellow);
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    expect(Tuffnut.zone("arena").filter((id) => id === "token:goldkiss-rum")).toHaveLength(0);
  });
});
