import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { aetherSinkYellow } from "./aether-sink.ts";
import { throttleRed } from "./throttle.ts";
import { dash } from "../heroes/dash.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { nimblismBlue } from "./nimblism.ts";
import { smashAndGrabRed } from "./smash-and-grab.ts";

describe("Smash and Grab (EVO155) AAA", () => {
  it("happy: after two boosts this is 7{p} and steals an item on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [throttleRed, throttleRed, smashAndGrabRed, nimblismBlue, nimblismBlue],
        resourcePoints: 10,
        actionPoints: 3,
        deck: 6,
      },
      {
        hero: dash,
        arena: [aetherSinkYellow],
        hand: [],
        life: 40,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    Teklo.play(throttleRed, { boost: true });
    game.closeCombat({ optionals: "decline" });
    Teklo.play(throttleRed, { boost: true });
    game.closeCombat({ optionals: "decline" });
    Teklo.playAttack(smashAndGrabRed);
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });
    expectFabPlayer(game.as(dash)).toHaveLife(21);
    expectFabCard(Teklo, aetherSinkYellow).toBeIn("arena");
  });

  it("boundary: without two boosts this stays 5{p} and does not steal", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [smashAndGrabRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        arena: [aetherSinkYellow],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    Teklo.playAttack(smashAndGrabRed);
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat();
    expectFabCard(game.as(dash), aetherSinkYellow).toBeIn("arena");
  });

  it("timing: a miss after two boosts does not steal the item", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [throttleRed, throttleRed, smashAndGrabRed, nimblismBlue, nimblismBlue],
        resourcePoints: 10,
        actionPoints: 3,
        deck: 6,
      },
      {
        hero: dash,
        arena: [aetherSinkYellow],
        hand: [nimblismBlue, nimblismBlue, nimblismBlue],
        life: 40,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    const Dash = game.as(dash);
    Teklo.play(throttleRed, { boost: true });
    game.closeCombat({ optionals: "decline" });
    Teklo.play(throttleRed, { boost: true });
    game.closeCombat({ optionals: "decline" });
    Teklo.playAttack(smashAndGrabRed);
    Dash.defendWith([nimblismBlue, nimblismBlue, nimblismBlue]);
    game.closeCombat();
    expect(Dash.zone("arena").length + Teklo.zone("arena").length).toBeGreaterThan(0);
  });
});
