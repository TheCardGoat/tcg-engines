import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { snatchRed } from "../actions/snatch.ts";
import { ironsongResponseRed } from "./ironsong-response.ts";

/**
 * Ironsong Response Red (WTR132) — Warrior Attack Reaction.
 *
 * Printed:
 *   Reprise - If the defending hero has defended with a card from their hand
 *   this chain link, target weapon attack gains +3{p}.
 */

describe("ironsong-response family AAA", () => {
  it("happy: Reprise gives +3 power after a hand defense", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [ironsongResponseRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);
    const Dash = game.as(dash);

    Kassai.must.activate(cintariSaber);
    game.advanceCombatTo("defend");
    Dash.must.defend(snatchRed);
    game.advanceCombatTo("reaction");
    Kassai.must.playReaction(ironsongResponseRed);
    game.passBoth();

    // Cintari 2 + defended-by-attack-action +1 + Reprise +3 = 6.
    expectCombat(game).toHaveAttackPower(6);
    expectFabCard(Kassai, ironsongResponseRed).toBeIn("graveyard");
  });

  it("boundary: no Reprise bonus without a hand defense", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [ironsongResponseRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.must.activate(cintariSaber);
    game.advanceCombatTo("reaction");
    Kassai.must.playReaction(ironsongResponseRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(2);
    expectFabCard(Kassai, ironsongResponseRed).toBeIn("graveyard");
  });
});
