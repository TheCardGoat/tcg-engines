import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { katsu } from "../heroes/katsu.ts";
import { snatchRed } from "./snatch.ts";
import { tripTheLightFantasticRed } from "./trip-the-light-fantastic.ts";

describe("Trip the Light Fantastic (ROS104) AAA", () => {
  it("happy: Instant discard prevents 2 of Snatch's 4 damage", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: katsu, hand: [tripTheLightFantasticRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    game.as(dash).playAttack(snatchRed);
    Katsu.defendWith();
    game.as(dash).pass();
    Katsu.activate(tripTheLightFantasticRed);
    game.closeCombat();

    expectFabCard(Katsu, tripTheLightFantasticRed).toBeIn("graveyard");
    expectFabPlayer(Katsu).toHaveLife(18);
  });

  it("boundary: without the Instant, Snatch deals 4", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: katsu, hand: [tripTheLightFantasticRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    game.as(dash).playAttack(snatchRed);
    game.closeCombat();

    expectFabCard(Katsu, tripTheLightFantasticRed).toBeIn("hand");
    expectFabPlayer(Katsu).toHaveLife(16);
  });

  it("timing: the shield is this-turn only", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed, snatchRed], actionPoints: 1, deck: 6 },
      { hero: katsu, hand: [tripTheLightFantasticRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Katsu = game.as(katsu);

    Dash.playAttack(snatchRed);
    Katsu.defendWith();
    Dash.pass();
    Katsu.activate(tripTheLightFantasticRed);
    game.closeCombat();
    expectFabPlayer(Katsu).toHaveLife(18);

    Dash.endTurn();
    Katsu.endTurn();
    Dash.playAttack(snatchRed);
    game.closeCombat();
    expectFabPlayer(Katsu).toHaveLife(14);
  });
});
