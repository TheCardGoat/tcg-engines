import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { boltyn } from "../heroes/boltyn.ts";
import { bravo } from "../heroes/bravo.ts";
import { luminaAscensionYellow } from "./lumina-ascension.ts";
import { snatchRed } from "./snatch.ts";
import { spiritOfEirinaYellow } from "./spirit-of-eirina.ts";

/**
 * Spirit of Eirina (DYN066) — Light Warrior Action Item, Legendary.
 *
 * Printed: If Spirit of Eirina would be put into your soul, instead put it
 * into the arena. You may play Lumina Ascension as though it were an instant.
 *
 * Lumina Ascension is MON034 (stale "not authored" pin). The instant line is
 * a while-in-arena play-card grant (no printed "this turn"), not an immediate
 * play-from-soul optional.
 */

describe("Spirit of Eirina (DYN066) AAA", () => {
  it("happy: while this is in the arena, Lumina Ascension may be played as an instant", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [spiritOfEirinaYellow, luminaAscensionYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(spiritOfEirinaYellow);
    game.untilIdle({ ordering: "listed" });
    expectFabCard(Boltyn, spiritOfEirinaYellow).toBeIn("arena");

    Boltyn.play(luminaAscensionYellow);
    game.untilIdle({ ordering: "listed" });
    expectFabCard(Boltyn, luminaAscensionYellow).toBeIn("graveyard");
  });

  it("boundary: without the grant, Lumina Ascension is an Action and needs an action point", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [luminaAscensionYellow, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.playAttack(snatchRed);
    game.closeCombat();
    expectFabUnplayable(
      () => Boltyn.play(luminaAscensionYellow),
      /action-?point cost cannot be paid/i,
    );
  });

  it("timing: the grant lasts while Spirit remains in the arena, including the opponent's turn", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [spiritOfEirinaYellow, luminaAscensionYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], actionPoints: 1, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Bravo = game.as(bravo);

    Boltyn.play(spiritOfEirinaYellow);
    game.untilIdle({ ordering: "listed" });
    expectFabCard(Boltyn, spiritOfEirinaYellow).toBeIn("arena");

    Boltyn.endTurn();
    game.untilIdle({ ordering: "listed" });
    Bravo.pass();
    Boltyn.play(luminaAscensionYellow);
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Boltyn, luminaAscensionYellow).toBeIn("graveyard");
  });
});
