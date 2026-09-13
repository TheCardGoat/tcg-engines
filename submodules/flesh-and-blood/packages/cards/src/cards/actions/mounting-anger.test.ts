import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { roninRenegadeRed } from "./ronin-renegade.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { mountingAngerRed } from "./mounting-anger.ts";

/**
 * Mounting Anger, Red (UPR054) — Draconic Ninja Attack, cost 1, 4{p}, go again.
 * Printed: "When this hits, you may banish an attack action card from your hand
 * with cost less than the number of Draconic chain links you control. If you do,
 * it gains +1{p} and you may play it this turn."
 */

describe("Mounting Anger (UPR054) AAA", () => {
  it("happy: on hit, banish a cheaper attack; it gains +1{p} and may be played", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [mountingAngerRed, roninRenegadeRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(mountingAngerRed);
    game.closeCombat({ optionals: "accept", ordering: "listed" });
    Fai.target(roninRenegadeRed);
    expectFabCard(Fai, roninRenegadeRed).toBeBanished();
    Fai.attackWith(roninRenegadeRed, { from: "banished" });
    expectCombat(game).toBeOpen();
  });

  it("boundary: a cost-2 attack is not cheaper than 1 Draconic chain link", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [mountingAngerRed, brutalAssaultBlue],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(mountingAngerRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    game.helpers.resolveRestOfCombat();
    expectFabCard(Fai, brutalAssaultBlue).toBeIn("hand");
  });
});
