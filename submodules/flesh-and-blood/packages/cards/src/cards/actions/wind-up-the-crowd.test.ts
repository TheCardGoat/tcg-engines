import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { tuffnut } from "../heroes/tuffnut.ts";
import { dash } from "../heroes/dash.ts";
import { windUpTheCrowdBlue } from "./wind-up-the-crowd.ts";

describe("Wind Up the Crowd (SUP006) AAA", () => {
  it("happy: Instant discard creates a Toughness token and a Vigor token", () => {
    const game = FabTestEngine.start(
      { hero: tuffnut, hand: [windUpTheCrowdBlue], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.activate(windUpTheCrowdBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Tuffnut, windUpTheCrowdBlue).toBeIn("graveyard");
    expect(Tuffnut.zone("arena")).toContain("token:toughness");
    expect(Tuffnut.zone("arena")).toContain("token:vigor");
    expectFabPlayer(Tuffnut).toHaveAP(1);
  });

  it("boundary: played as an attack it hits for printed 6 and does not create tokens", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [windUpTheCrowdBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.attackWith(windUpTheCrowdBlue);
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(14);
    expect(Tuffnut.zone("arena")).not.toContain("token:toughness");
    expect(Tuffnut.zone("arena")).not.toContain("token:vigor");
  });
});
