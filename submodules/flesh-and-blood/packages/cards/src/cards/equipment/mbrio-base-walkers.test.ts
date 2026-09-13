import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { snatchRed } from "../actions/snatch.ts";
import { mbrioBaseWalkers } from "./mbrio-base-walkers.ts";

describe("mBrio Base Walkers (PEN061) AAA", () => {
  it("happy: Quell 1 pays {r} to prevent 1 and destroys this at end of turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: teklovossen,
        life: 20,
        legs: [mbrioBaseWalkers],
        resourcePoints: 1,
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    expectFabCard(Teklo, mbrioBaseWalkers).toHaveKeyword("quell");
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveUntilIdle({ optionalOptions: "all" });

    expectFabPlayer(Teklo).toHaveLife(17);
    expectFabCard(Teklo, mbrioBaseWalkers).toBeIn("legs");
    expectFabPlayer(Teklo).toHaveResourceCount(0);

    game.as(bravo).endTurn();
    expectFabCard(Teklo, mbrioBaseWalkers).toBeIn("graveyard");
  });

  it("boundary: without {r} Quell cannot prevent and the walkers stay equipped", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: teklovossen,
        life: 20,
        legs: [mbrioBaseWalkers],
        resourcePoints: 0,
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Teklo).toHaveLife(16);
    expectFabCard(Teklo, mbrioBaseWalkers).toBeIn("legs");
  });

  it("timing: unused walkers stay equipped through the end of turn", () => {
    const game = FabTestEngine.start(
      { hero: teklovossen, legs: [mbrioBaseWalkers], hand: [], deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Teklo, mbrioBaseWalkers).toBeIn("legs");
  });
});
