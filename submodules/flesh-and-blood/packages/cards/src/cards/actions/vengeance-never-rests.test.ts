import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { edgeOfAutumn } from "../weapons/edge-of-autumn.ts";
import { vengeanceNeverRestsBlue } from "./vengeance-never-rests.ts";

describe("Vengeance Never Rests (ASR025) AAA", () => {
  it("happy: after Edge of Autumn this banishes itself on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [edgeOfAutumn],
        hand: [vengeanceNeverRestsBlue],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    Bravo.activateAttack(edgeOfAutumn);
    game.advanceCombatTo("resolution");
    Bravo.playAttack(vengeanceNeverRestsBlue);
    expectCombat(game).toHaveAttackPower(3).toHaveKeyword("go-again");
    game.closeCombat({ optionals: "decline" });
    expectFabCard(Bravo, vengeanceNeverRestsBlue).toBeBanished();
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("boundary: without Edge of Autumn this stays in the graveyard after a hit", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [vengeanceNeverRestsBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    Bravo.playAttack(vengeanceNeverRestsBlue);
    game.closeCombat();
    expectFabCard(Bravo, vengeanceNeverRestsBlue).toBeIn("graveyard");
    expectFabPlayer(game.as(dash)).toHaveLife(17);
  });

  it("timing: combo go again refunds AP after Edge of Autumn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [edgeOfAutumn],
        hand: [vengeanceNeverRestsBlue],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    Bravo.activateAttack(edgeOfAutumn);
    game.advanceCombatTo("resolution");
    Bravo.playAttack(vengeanceNeverRestsBlue);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Bravo).toHaveAP(2);
  });
});
