import { describe, it } from "vitest";
import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectFabCard,
  expectFabPlayer,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { stokeVengeanceRed } from "./stoke-vengeance.ts";
import { edgeOfAutumn } from "../weapons/edge-of-autumn.ts";
import { katsu } from "../heroes/katsu.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
describe("Stoke Vengeance preview behavior", () => {
  it("after Edge of Autumn, go again permits a follow-up attack with plus two power", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [stokeVengeanceRed, brutalAssaultBlue],
        weapon1: [edgeOfAutumn],
        resourcePoints: 5,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const player = game.as(katsu);
    player.activateAttack(edgeOfAutumn);
    game.advanceUntil({ stopAt: "resolution", optionals: "decline", ordering: "listed" });
    player.playAttack(stokeVengeanceRed);
    expectCombat(game).toHaveKeyword("go-again");
    game.advanceUntil({ stopAt: "resolution", optionals: "decline", ordering: "listed" });
    player.playAttack(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(game.as(dash)).toHaveLife(9);
  });
  it("without the weapon attack it does not gain go again", () => {
    const game = FabTestEngine.start(
      { hero: katsu, hand: [stokeVengeanceRed], resourcePoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(katsu).playAttack(stokeVengeanceRed);
    expectCombat(game).notToHaveKeyword("go-again");
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(game.as(katsu)).toHaveAP(0);
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });
});
