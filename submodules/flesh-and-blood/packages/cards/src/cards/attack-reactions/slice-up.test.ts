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
import { sliceUpRed } from "./slice-up.ts";

/**
 * Slice Up (MPW089) — Warrior Attack Reaction, cost 0, 3{d}.
 *
 * Printed: 'Target weapon attack gets "When this hits a hero, you may remove
 * a +1{p} counter from this weapon. If you do, they discard a card."'
 */

describe("Slice Up (MPW089) AAA", () => {
  it("happy: on hit, removing the weapon's +1{p} counter makes them discard a card", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [sliceUpRed],
        weapon1: [{ card: cintariSaber, state: { powerCounterTotal: 1 } }],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);
    const Dash = game.as(dash);

    Kassai.activateAttack(cintariSaber);
    game.toReaction("attacker");
    Kassai.must.playReaction(sliceUpRed);
    game.closeCombat({ optionals: "accept", ordering: "listed" });

    expectFabCard(Kassai, cintariSaber).toHaveCounters(0);
    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveHandCount(0).toHaveLife(17); // 3{p} hit
  });

  it("boundary: declining the on-hit optional keeps the counter and their hand", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [sliceUpRed],
        weapon1: [{ card: cintariSaber, state: { powerCounterTotal: 1 } }],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);
    const Dash = game.as(dash);

    Kassai.activateAttack(cintariSaber);
    game.toReaction("attacker");
    Kassai.must.playReaction(sliceUpRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Kassai, cintariSaber).toHaveCounters(1);
    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
    expectFabPlayer(Dash).toHaveHandCount(1).toHaveLife(17);
  });
});
