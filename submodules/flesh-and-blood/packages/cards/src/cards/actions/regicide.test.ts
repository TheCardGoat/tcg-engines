import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { arakni } from "../heroes/arakni.ts";
import { dash } from "../heroes/dash.ts";
import { fangDracaiOfBlades } from "../heroes/fang-dracai-of-blades.ts";
import { nimblismBlue } from "./nimblism.ts";
import { regicideBlue } from "./regicide.ts";

describe("Regicide (DYN121) AAA", () => {
  it("happy: hitting a Royal hero makes them lose the game", () => {
    const game = FabTestEngine.start(
      { hero: arakni, hand: [regicideBlue], actionPoints: 1, deck: 6 },
      { hero: fangDracaiOfBlades, life: 40, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Fang = game.as(fangDracaiOfBlades);

    Arakni.attackWith(regicideBlue);
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Fang).toHaveLife(37);
    game.assertGameEnded(Arakni);
  });

  it("boundary: hitting a non-Royal hero does not make them lose from the hit", () => {
    const game = FabTestEngine.start(
      { hero: arakni, hand: [regicideBlue], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(regicideBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Arakni, regicideBlue).toBeIn("graveyard");
    game.assertGameEnded(Dash);
  });

  it("boundary: specialization is deckbuilding-only — Dash can still play it in-match", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [regicideBlue], actionPoints: 1, deck: 6 },
      { hero: arakni, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.attackWith(regicideBlue);
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
    expectFabCard(Dash, regicideBlue).toBeIn("combatChain");
  });

  it("timing: a fully blocked miss still closes the chain and you lose the game", () => {
    const game = FabTestEngine.start(
      { hero: arakni, hand: [regicideBlue], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(regicideBlue);
    game.advanceCombatTo("defend");
    Dash.defendWith([nimblismBlue, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    game.assertGameEnded(Dash);
  });
});
