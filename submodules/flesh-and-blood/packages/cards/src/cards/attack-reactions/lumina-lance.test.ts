import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { boltyn } from "../heroes/boltyn.ts";
import { crossTheLineRed } from "../actions/cross-the-line.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { luminaLanceYellow } from "./lumina-lance.ts";

/**
 * Lumina Lance, Yellow (DTD080) — Light Attack Reaction, cost 0, 3{d}.
 *
 * Printed: "As an additional cost to play this, banish up to 3 cards from
 * your hero's soul. Choose that many modes;"
 */

describe("Lumina Lance (DTD080) AAA", () => {
  it("happy: banishing 1 soul card pays the additional cost", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [crossTheLineRed, luminaLanceYellow],
        soul: [nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const soulId = Boltyn.cardsIn("soul", nimblismBlue)[0]!.instanceId;

    Boltyn.must.playAttack(crossTheLineRed);
    game.advanceCombatTo("reaction");

    Boltyn.play(luminaLanceYellow, {
      targetInstanceId: soulId,
      modeIds: ["mrnPzLtk7hmh6qnznHRzK:banishSoulAndChooseModes:boostLightAttack"],
    });
    expectFabCard(Boltyn, nimblismBlue).toBeIn("banished");
    expectFabCard(Boltyn, luminaLanceYellow).toBeIn("stack");
  });

  it("boundary: empty soul pays 0 and the attack stays at printed power", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [crossTheLineRed, luminaLanceYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.must.playAttack(crossTheLineRed);
    game.advanceCombatTo("reaction");

    Boltyn.play(luminaLanceYellow);
    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [luminaLanceYellow],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Boltyn.defendWith([luminaLanceYellow]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Boltyn).toHaveLife(19);
    expectFabCard(Boltyn, luminaLanceYellow).toBeIn("graveyard");
  });
});
