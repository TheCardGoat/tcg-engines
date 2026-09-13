import { describe, it } from "vitest";
import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectFabCard,
  expectFabPlayer,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rushOfKnowledgeBlue } from "./rush-of-knowledge.ts";
import { prism } from "../heroes/prism.ts";
import { ponder } from "../tokens/ponder.ts";
import { brutalAssaultRed } from "./brutal-assault.ts";
describe("Rush of Knowledge preview behavior", () => {
  for (const pay of [true, false]) {
    it(`${pay ? "destroys" : "keeps"} Ponder and ${pay ? "draws with an extra action point" : "gains no benefit"}`, () => {
      const game = FabTestEngine.start(
        { hero: prism, hand: [rushOfKnowledgeBlue], arena: [ponder], resourcePoints: 4, deck: 6 },
        { hero: dash, hand: [], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const player = game.as(prism);
      player.play(rushOfKnowledgeBlue);
      game.advanceUntil({
        stopAt: "defend",
        optionals: pay ? "accept" : "decline",
        entityTargets: "maximum",
      });
      if (pay) expectFabPlayer(player).toHaveTokenCount("ponder", 0);
      else expectFabCard(player, ponder).toBeIn("arena");
      expectFabPlayer(player)
        .toHaveHandCount(pay ? 1 : 0)
        .toHaveAP(pay ? 1 : 0);
    });
  }
  it("phantasm destroys the attack when a six-power attack defends", () => {
    const game = FabTestEngine.start(
      { hero: prism, hand: [rushOfKnowledgeBlue], resourcePoints: 4, deck: 6 },
      { hero: dash, hand: [brutalAssaultRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(prism).play(rushOfKnowledgeBlue);
    game.advanceUntil({ stopAt: "defend", optionals: "decline" });
    game.as(dash).defendWith(brutalAssaultRed);
    game.untilIdle();
    expectFabCard(game.as(prism), rushOfKnowledgeBlue).toBeIn("graveyard");
    expectFabPlayer(game.as(dash)).toHaveLife(20);
    expectCombat(game).toBeClosed();
  });
});
