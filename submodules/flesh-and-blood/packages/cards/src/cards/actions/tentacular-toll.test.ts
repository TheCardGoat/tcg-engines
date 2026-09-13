import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { dash } from "../heroes/dash.ts";
import { themisArchangelOfJudgment } from "../allies/themis-archangel-of-judgment.ts";
import { cromai } from "../allies/cromai.ts";
import { nekria } from "../allies/nekria.ts";
import { snatchRed } from "./snatch.ts";
import { tentacularTollRed } from "./tentacular-toll.ts";

/**
 * Tentacular Toll (PEN162) — Pirate Necromancer Action, cost 0, go again.
 * Printed: Turn up to 3 ally cards in your graveyard face-down, then create
 * that many Gold tokens.
 *
 * Gold equal to allies turned face-down this way.
 */

describe("Tentacular Toll (PEN162) AAA", () => {
  it("happy: turning 3 graveyard allies face-down creates 3 Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [tentacularTollRed],
        graveyard: [cromai, nekria, themisArchangelOfJudgment],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(tentacularTollRed);
    game.untilIdle({ entityTargets: "maximum" });
    expectFabCard(Gravy, cromai).toBeIn("graveyard");
    expectFabCard(Gravy, cromai).toBeFaceDown();
    expectFabToken(game, "gold").toHaveCount(3);
  });

  it("boundary: a non-ally graveyard creates no Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [tentacularTollRed],
        graveyard: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(tentacularTollRed);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });
    expectFabCard(Gravy, snatchRed).toBeIn("graveyard");
    expectFabToken(game, "gold").toHaveCount(0);
  });

  it("timing: go again refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [tentacularTollRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(tentacularTollRed);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });
    expectFabPlayer(Gravy).toHaveAP(1);
  });
});
