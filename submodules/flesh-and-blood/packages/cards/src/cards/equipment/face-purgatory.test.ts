import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { facePurgatory } from "./face-purgatory.ts";

describe("Face Purgatory (ROS114) AAA", () => {
  it("happy: defending with an attack action and a non-attack makes the attacker discard and you draw", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed, nimblismBlue], actionPoints: 1, deck: 6 },
      {
        hero: viserai,
        head: [facePurgatory],
        hand: [snatchRed, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Viserai = game.as(viserai);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Viserai.defendWith([facePurgatory, snatchRed, nimblismBlue]);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveHandCount(0);
    expectFabPlayer(Viserai).toHaveHandCount(1).toHaveLife(20);
    expectFabCard(Viserai, facePurgatory).toBeIn("graveyard");
  });

  it("boundary: defending without both partner types does not discard or draw", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed, nimblismBlue], actionPoints: 1, deck: 6 },
      {
        hero: viserai,
        head: [facePurgatory],
        hand: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Viserai = game.as(viserai);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Viserai.defendWith([facePurgatory, nimblismBlue]);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
    expectFabPlayer(Viserai).toHaveHandCount(0);
    expectFabCard(Viserai, facePurgatory).toBeIn("graveyard");
  });

  it("timing: Blade Break destroys Face Purgatory after the together-defend", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed, nimblismBlue], actionPoints: 1, deck: 6 },
      {
        hero: viserai,
        head: [facePurgatory],
        hand: [snatchRed, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Viserai = game.as(viserai);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Viserai.defendWith([facePurgatory, snatchRed, nimblismBlue]);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Viserai, facePurgatory).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveHandCount(0);
    expectFabPlayer(Viserai).toHaveHandCount(1);
  });
});
