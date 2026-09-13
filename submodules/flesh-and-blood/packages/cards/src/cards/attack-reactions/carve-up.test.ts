import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kassai } from "../heroes/kassai.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { carveUpYellow } from "./carve-up.ts";

/**
 * Carve Up (MPW079) — Warrior Attack Reaction, cost 0, 3{d}.
 *
 * Printed: 'Target weapon attack gets "When this hits a hero, you may remove
 * a +1{p} counter from this weapon. If you do, destroy a card in their
 * arsenal."'
 */

describe("Carve Up (MPW079) AAA", () => {
  it("happy: on hit, removing the weapon's +1{p} counter destroys a card in their arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [carveUpYellow],
        weapon1: [{ card: cintariSaber, state: { powerCounterTotal: 1 } }],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arsenal: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);
    const Dash = game.as(dash);

    Kassai.activateAttack(cintariSaber);
    game.toReaction("attacker");
    Kassai.must.playReaction(carveUpYellow);
    game.closeCombat({ optionals: "accept", ordering: "listed" });

    expectFabCard(Kassai, cintariSaber).toHaveCounters(0);
    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(17); // 3{p} hit
    expectFabCard(Kassai, carveUpYellow).toBeIn("graveyard");
  });

  it("boundary: declining the on-hit optional keeps the counter and the arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [carveUpYellow],
        weapon1: [{ card: cintariSaber, state: { powerCounterTotal: 1 } }],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arsenal: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);
    const Dash = game.as(dash);

    Kassai.activateAttack(cintariSaber);
    game.toReaction("attacker");
    Kassai.must.playReaction(carveUpYellow);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Kassai, cintariSaber).toHaveCounters(1);
    expectFabCard(Dash, nimblismBlue).toBeIn("arsenal");
    expectFabPlayer(Dash).toHaveLife(17);
  });
});
