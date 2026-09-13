import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { kano } from "../heroes/kano.ts";
import { weaveIceRed } from "../actions/weave-ice.ts";
import { oldhim } from "../heroes/oldhim.ts";
import { snatchRed } from "../actions/snatch.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { bitingGaleRed } from "./biting-gale.ts";

/**
 * Biting Gale Red (ELE007) — Elemental Guardian Defense Reaction.
 *
 * Printed: Ice Fusion
 * If Biting Gale was fused, the attacking hero discards a card unless they
 * pay {r}{r}.
 */

describe("Biting Gale family AAA", () => {
  it("happy: fused, an unpayable attacker discards", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [brutalAssaultBlue, snatchRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: oldhim,
        hand: [bitingGaleRed, weaveIceRed],
        resourcePoints: 2,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Oldhim = game.as(oldhim);

    Kano.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("reaction");
    Kano.pass();
    Oldhim.play(bitingGaleRed, { fuse: true, fuseCards: [weaveIceRed] });
    game.helpers.resolveUntilIdle({ optionalBoolean: false, ordering: "listed" });

    // Fused gale: Kano cannot pay {r}{r} (spent on the swing) and discards.
    expectFabCard(Kano, snatchRed).toBeIn("graveyard");
    expectFabCard(Oldhim, weaveIceRed).toBeIn("hand"); // reveal stays in hand
  });

  it("boundary: unfused, the attacker keeps their hand", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [brutalAssaultBlue, snatchRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: oldhim,
        hand: [bitingGaleRed],
        resourcePoints: 2,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Oldhim = game.as(oldhim);

    Kano.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("reaction");
    Kano.pass();
    Oldhim.play(bitingGaleRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, ordering: "listed" });

    expectFabCard(Kano, snatchRed).toBeIn("hand"); // no discard without fusion
  });
});
