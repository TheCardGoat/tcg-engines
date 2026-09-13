import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { biteBlue } from "../actions/bite.ts";
import { snatchRed } from "../actions/snatch.ts";
import { hissRed } from "../attack-reactions/hiss.ts";
import { arakni } from "../heroes/arakni.ts";
import { dash } from "../heroes/dash.ts";
import { silver } from "../tokens/silver.ts";
import { redbackShroud } from "./redback-shroud.ts";

/**
 * Redback Shroud (OUT011) — Assassin Chest d1 Battleworn.
 *
 * Printed: While this is in your graveyard, at the start of your turn, you
 * may destroy 2 Silver you control. If you do, equip this.
 * Attack Reaction - Destroy this: The next attack reaction card you play
 * this turn costs {r} less to play.
 */

describe("Redback Shroud (OUT011) AAA", () => {
  it("happy: destroying this discounts the next attack reaction by {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        chest: [redbackShroud],
        hand: [biteBlue, hissRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.playAttack(biteBlue);
    game.toReaction("attacker");
    Arakni.activate(redbackShroud);
    Arakni.pass();
    game.as(dash).pass();
    expectFabCard(Arakni, redbackShroud).toBeIn("graveyard");

    Arakni.must.playReaction(hissRed);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(4);
    expectFabPlayer(Arakni).toHaveResourceCount(0);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("boundary: without the Shroud discount, the reaction cannot be paid for at 0 resources", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [biteBlue, hissRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.playAttack(biteBlue);
    game.toReaction("attacker");

    expectFabUnplayable(() => Arakni.must.playReaction(hissRed), /resource cost cannot be paid/i);
    expectFabCard(Arakni, hissRed).toBeIn("hand");
  });

  it("boundary: at start of turn, two Silver re-equip this from the graveyard", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6, intellect: 0 },
      {
        hero: arakni,
        graveyard: [redbackShroud],
        arena: [silver, silver],
        deck: 6,
        intellect: 0,
      },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept", entityTargets: "maximum" });

    expectFabCard(Arakni, redbackShroud).toBeIn("chest");
  });

  it("boundary: one Silver cannot re-equip this from the graveyard", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6, intellect: 0 },
      {
        hero: arakni,
        graveyard: [redbackShroud],
        arena: [silver],
        deck: 6,
        intellect: 0,
      },
      FAB_MANUAL_HARNESS,
    );

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    expectFabCard(game.as(arakni), redbackShroud).toBeIn("graveyard");
  });

  it("timing: Battleworn reduces defense after this defends but leaves it equipped", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: arakni, chest: [redbackShroud], hand: [], life: 20, deck: 6 },
    );
    const Arakni = game.as(arakni);

    game.as(dash).playAttack(snatchRed);
    Arakni.defendWith(redbackShroud);
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Arakni, redbackShroud).toBeIn("chest");
    expectFabCard(Arakni, redbackShroud).toHaveDefenseCounters(-1);
    expectFabPlayer(Arakni).toHaveLife(17);
  });
});
