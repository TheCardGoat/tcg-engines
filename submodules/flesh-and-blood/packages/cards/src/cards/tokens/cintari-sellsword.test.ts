import { describe, it } from "vitest";
import {
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { edgeOfAutumn } from "../weapons/edge-of-autumn.ts";
import { cintariSellsword } from "./cintari-sellsword.ts";

/**
 * Cintari Sellsword (FAB191) — Warrior Token - Mercenary Ally. 3{p}.
 * Printed: "Once per Turn Action - {r}: Attack. Go again. Cintari Sellsword
 * can only attack if you've attacked with a weapon this turn."
 */
describe("Cintari Sellsword (FAB191) AAA", () => {
  it("happy: after a weapon attack the sellsword attacks for 3 with go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [cintariSellsword],
        weapon1: [edgeOfAutumn],
        hand: [],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    // Weapon attack (Edge of Autumn has printed go again) arms the sellsword
    // and refunds the action point.
    Bravo.activateAttack(edgeOfAutumn);
    game.advanceUntil({ stopAt: "defend" });
    game.as(dash).defendWith();
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Bravo).toHaveAP(1);

    Bravo.activate(cintariSellsword);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(3);
    game.as(dash).defendWith();
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectCombat(game).toBeClosed();
    expectFabPlayer(Bravo).toHaveAP(1);
    expectFabCard(Bravo, cintariSellsword).toBeIn("arena");
  });

  it("boundary: the sellsword's attack is once per turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [cintariSellsword],
        weapon1: [edgeOfAutumn],
        hand: [],
        resourcePoints: 4,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.activateAttack(edgeOfAutumn);
    game.advanceUntil({ stopAt: "defend" });
    game.as(dash).defendWith();
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    Bravo.activate(cintariSellsword);
    game.advanceUntil({ stopAt: "defend" });
    game.as(dash).defendWith();
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    Bravo.expectActivationRejected(cintariSellsword);
    expectFabCard(Bravo, cintariSellsword).toBeIn("arena");
  });

  it("boundary: without a prior weapon attack the sellsword cannot attack", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [cintariSellsword],
        weapon1: [edgeOfAutumn],
        hand: [],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.expectActivationRejected(cintariSellsword);
    expectFabPlayer(game.as(dash)).toHaveLife(20);
    expectFabCard(Bravo, cintariSellsword).toBeIn("arena");
  });
});
