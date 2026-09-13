import { describe, it } from "vitest";
import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectFabCard,
  expectFabPlayer,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { reachOfTheAbyss } from "./reach-of-the-abyss.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { malice } from "../heroes/malice.ts";
describe("Reach of the Abyss preview behavior", () => {
  for (const defend of [true, false]) {
    it(`${defend ? "banishes" : "does not banish"} defending cards when the chain closes`, () => {
      const game = FabTestEngine.start(
        { hero: dash, hand: [brutalAssaultBlue], resourcePoints: 2, deck: 6 },
        { hero: malice, hand: [brutalAssaultBlue], arms: [reachOfTheAbyss], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const defender = game.as(malice);
      game.as(dash).playAttack(brutalAssaultBlue);
      if (defend) defender.defendWith(reachOfTheAbyss, brutalAssaultBlue);
      else defender.defendWith(brutalAssaultBlue);
      game.closeCombat();
      expectFabCard(defender, brutalAssaultBlue).toBeIn(defend ? "banished" : "graveyard");
      expectFabCard(defender, reachOfTheAbyss).toBeIn(defend ? "banished" : "arms");
      expectFabCard(game.as(dash), brutalAssaultBlue).toBeIn("graveyard");
    });
  }
});
