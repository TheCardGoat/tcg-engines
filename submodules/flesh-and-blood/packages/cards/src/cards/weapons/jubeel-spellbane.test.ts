import { describe, it } from "vitest";
import { FabTestEngine, expectFabPlayer, fabToken } from "@tcg/flesh-and-blood-engine/testing";

import { dash } from "../heroes/dash.ts";
import { dorinthea } from "../heroes/dorinthea.ts";
import { jubeelSpellbane } from "./jubeel-spellbane.ts";

/**
 * Jubeel, Spellbane (DYN067) — Warrior Weapon - Sword (2H), 3{p}.
 *
 * Printed:
 *   Once per Turn Action - {r}: Attack
 *   Whenever this hits a hero and you don't control a Spellbane Aegis, create
 *   a Spellbane Aegis token.
 */

describe("Jubeel, Spellbane (DYN067) AAA", () => {
  it("happy: on hit, a Spellbane Aegis token is created", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [jubeelSpellbane],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Dori = game.as(dorinthea);

    Dori.activateAttack(jubeelSpellbane);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dori).toHaveTokenCount("spellbane-aegis", 1);
    expectFabPlayer(game.as(dash)).toHaveLife(17);
  });

  it("boundary: already controlling a Spellbane Aegis, the hit creates no second token", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [jubeelSpellbane],
        arena: [fabToken("spellbane-aegis")],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Dori = game.as(dorinthea);

    Dori.activateAttack(jubeelSpellbane);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dori).toHaveTokenCount("spellbane-aegis", 1);
    expectFabPlayer(game.as(dash)).toHaveLife(17);
  });
});
