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
import { emergingPowerRed } from "../actions/emerging-power.ts";
import { diceUpBlue } from "./dice-up.ts";

/**
 * Dice Up (MPW083) — Warrior Attack Reaction, cost 0, 3{d}.
 *
 * Printed: 'Target weapon attack gets "When this hits a hero, you may remove
 * a +1{p} counter from this weapon. If you do, destroy an aura they
 * control."'
 */

describe("Dice Up (MPW083) AAA", () => {
  it("happy: on hit, removing the weapon's +1{p} counter destroys an aura they control", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [diceUpBlue],
        weapon1: [{ card: cintariSaber, state: { powerCounterTotal: 1 } }],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arena: [emergingPowerRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);
    const Dash = game.as(dash);

    Kassai.activateAttack(cintariSaber);
    game.toReaction("attacker");
    Kassai.must.playReaction(diceUpBlue);
    game.closeCombat({ optionals: "accept", ordering: "listed" });

    expectFabCard(Kassai, cintariSaber).toHaveCounters(0);
    expectFabCard(Dash, emergingPowerRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(17); // 3{p} hit
  });

  it("boundary: declining the on-hit optional keeps the counter and the aura", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [diceUpBlue],
        weapon1: [{ card: cintariSaber, state: { powerCounterTotal: 1 } }],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arena: [emergingPowerRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);
    const Dash = game.as(dash);

    Kassai.activateAttack(cintariSaber);
    game.toReaction("attacker");
    Kassai.must.playReaction(diceUpBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Kassai, cintariSaber).toHaveCounters(1);
    expectFabCard(Dash, emergingPowerRed).toBeIn("arena");
    expectFabPlayer(Dash).toHaveLife(17);
  });
});
