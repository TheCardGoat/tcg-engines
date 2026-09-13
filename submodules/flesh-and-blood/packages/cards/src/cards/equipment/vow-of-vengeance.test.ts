import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { fang } from "../heroes/fang.ts";
import { arakni } from "../heroes/arakni.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { vowOfVengeance } from "./vow-of-vengeance.ts";

/**
 * Vow of Vengeance (CIN003) — Draconic Equipment - Head.
 *
 * Printed: Attack Reaction - Destroy this: Mark target Arakni. Blade Break.
 */

describe("Vow of Vengeance (CIN003) AAA", () => {
  it("happy: as an attack reaction, destroying this marks the attacking player's Arakni opponent", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        head: [vowOfVengeance],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: arakni, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);
    const Arakni = game.as(arakni);

    Fang.playAttack(snatchRed);
    game.toReaction("attacker");
    Fang.activate(vowOfVengeance);
    game.passBoth();

    expectFabPlayer(Arakni).toBeMarked();
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabCard(Fang, vowOfVengeance).toBeIn("graveyard");
  });

  it("boundary: with no Arakni seated the mark does not apply", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        head: [vowOfVengeance],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);
    const Dash = game.as(dash);

    Fang.playAttack(snatchRed);
    game.toReaction("attacker");
    Fang.activate(vowOfVengeance);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dash).notToBeMarked();
  });
});
