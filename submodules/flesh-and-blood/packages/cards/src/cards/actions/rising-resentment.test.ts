import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { roninRenegadeRed } from "./ronin-renegade.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { risingResentmentRed } from "./rising-resentment.ts";

describe("Rising Resentment (UPR075) AAA", () => {
  it("happy: on hit, banish a cheaper attack and play it this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [risingResentmentRed, roninRenegadeRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(risingResentmentRed);
    game.closeCombat({ optionals: "accept", ordering: "listed" });
    Fai.target(roninRenegadeRed);
    expectFabCard(Fai, roninRenegadeRed).toBeBanished();

    Fai.attackWith(roninRenegadeRed, { from: "banished" });
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
  });

  it("boundary: a cost-2 attack is not cheaper than 1 Draconic chain link", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [risingResentmentRed, brutalAssaultBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(risingResentmentRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    game.helpers.resolveRestOfCombat();
    expectFabCard(Fai, brutalAssaultBlue).toBeIn("hand");
  });
});
