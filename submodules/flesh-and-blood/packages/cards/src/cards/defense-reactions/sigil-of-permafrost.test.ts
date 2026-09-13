import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { kano } from "../heroes/kano.ts";
import { flashBoltRed } from "../instants/flash-bolt.ts";
import { weaveIceRed } from "../actions/weave-ice.ts";
import { oldhim } from "../heroes/oldhim.ts";
import { snatchRed } from "../actions/snatch.ts";
import { sigilOfPermafrostRed } from "./sigil-of-permafrost.ts";

/**
 * Sigil of Permafrost Red (UPR106) — Elemental Wizard Defense Reaction.
 *
 * Printed: Ice Fusion
 * If Sigil of Permafrost was fused, the next time you deal arcane damage
 * to a hero this turn, create that many Frostbite tokens under their
 * control.
 */

describe("Sigil of Permafrost (UPR106) AAA", () => {
  it("happy: fused, the next arcane damage creates that many Frostbites for the damaged hero", () => {
    const game = FabTestEngine.start(
      { hero: kano, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: oldhim,
        hand: [sigilOfPermafrostRed, weaveIceRed, flashBoltRed],
        resourcePoints: 4,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Oldhim = game.as(oldhim);

    Kano.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Kano.pass();
    Oldhim.play(sigilOfPermafrostRed, { fuse: true, fuseCards: [weaveIceRed] });
    game.passBoth();
    Kano.pass();
    Oldhim.play(flashBoltRed, { target: Kano.id });
    game.helpers.resolveUntilIdle({ optionalBoolean: false, ordering: "listed" });

    expectFabPlayer(Kano).toHaveLife(12);
    expectFabPlayer(Kano).toHaveTokenCount("frostbite", 3);
    expectFabPlayer(Oldhim).toHaveTokenCount("frostbite", 0);
    expectFabCard(Oldhim, sigilOfPermafrostRed).toBeIn("graveyard");
  });

  it("boundary: unfused, arcane damage seats no Frostbites", () => {
    const game = FabTestEngine.start(
      { hero: kano, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: oldhim,
        hand: [sigilOfPermafrostRed, flashBoltRed],
        resourcePoints: 4,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Oldhim = game.as(oldhim);

    Kano.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Kano.pass();
    Oldhim.play(sigilOfPermafrostRed);
    game.passBoth();
    Kano.pass();
    Oldhim.play(flashBoltRed, { target: Kano.id });
    game.helpers.resolveUntilIdle({ optionalBoolean: false, ordering: "listed" });

    expectFabPlayer(Kano).toHaveLife(12);
    expectFabPlayer(Kano).toHaveTokenCount("frostbite", 0);
  });

  it("timing: only the first arcane-damage event this turn creates Frostbites", () => {
    const game = FabTestEngine.start(
      { hero: kano, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: oldhim,
        hand: [sigilOfPermafrostRed, weaveIceRed, flashBoltRed, flashBoltRed],
        resourcePoints: 6,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Oldhim = game.as(oldhim);

    Kano.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Kano.pass();
    Oldhim.play(sigilOfPermafrostRed, { fuse: true, fuseCards: [weaveIceRed] });
    game.passBoth();
    Kano.pass();
    Oldhim.play(flashBoltRed, { target: Kano.id });
    game.passBoth();
    Kano.pass();
    Oldhim.play(flashBoltRed, { target: Kano.id });
    game.helpers.resolveUntilIdle({ optionalBoolean: false, ordering: "listed" });

    expectFabPlayer(Kano).toHaveLife(9);
    expectFabPlayer(Kano).toHaveTokenCount("frostbite", 3);
  });
});
