import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { edgeOfAutumn } from "../weapons/edge-of-autumn.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { enactVengeanceRed } from "./enact-vengeance.ts";

describe("Enact Vengeance (ASR008) AAA", () => {
  it("happy: after Edge of Autumn, a hit destroys their arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [enactVengeanceRed],
        weapon1: [edgeOfAutumn],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], arsenal: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Fai.activate(edgeOfAutumn);
    game.advanceCombatTo("resolution");
    Fai.playAttack(enactVengeanceRed);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(13); // 1 sword + 6 enact
  });

  it("boundary: without Edge of Autumn, a hit leaves arsenal intact", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [enactVengeanceRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], arsenal: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Fai.playAttack(enactVengeanceRed);
    expectCombat(game).toHaveAttackPower(6);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, nimblismBlue).toBeIn("arsenal");
    expectFabPlayer(Dash).toHaveLife(14);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [enactVengeanceRed], life: 20, deck: 6 },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Fai.defendWith([enactVengeanceRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Fai).toHaveLife(19);
  });
});
