import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { lungingPressBlue } from "../attack-reactions/lunging-press.ts";
import { spectralShield } from "../tokens/spectral-shield.ts";
import { pickToPiecesRed } from "./pick-to-pieces.ts";

describe("Pick to Pieces family AAA", () => {
  it("happy: an attack reaction this chain grants +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [pickToPiecesRed, lungingPressBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    Arakni.playAttack(pickToPiecesRed);
    game.advanceCombatTo("reaction");
    Arakni.must.playReaction(lungingPressBlue);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });

  it("boundary: without an attack reaction this stays 3{p}", () => {
    const game = FabTestEngine.start(
      { hero: arakni, hand: [pickToPiecesRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(arakni).playAttack(pickToPiecesRed);
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(17);
  });

  it("timing: granted unpreventable damage ignores Ward on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [pickToPiecesRed, lungingPressBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arena: [spectralShield], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    Arakni.playAttack(pickToPiecesRed);
    game.advanceCombatTo("reaction");
    Arakni.must.playReaction(lungingPressBlue);
    game.passBoth();
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });
});
