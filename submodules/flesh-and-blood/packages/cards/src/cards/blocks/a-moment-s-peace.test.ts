import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { hala } from "../heroes/hala.ts";
import { kassai } from "../heroes/kassai.ts";
import { zenithBlade } from "../weapons/zenith-blade.ts";
import { cutNCarveRed } from "../actions/cut-n-carve.ts";
import { snatchRed } from "../actions/snatch.ts";
import { andAgainBlue } from "../actions/and-again.ts";
import { aMomentSPeaceBlue } from "./a-moment-s-peace.ts";
import { nimblismBlue } from "../actions/nimblism.ts";

/**
 * A Moment's Peace (MPW075) — Warrior Block, 2{d}.
 *
 * Printed: "When this defends a sword attack, you can't be attacked by the
 * sword again this turn."
 */

describe("A Moment's Peace (MPW075) AAA", () => {
  it("happy: after defending a sword attack, that sword cannot attack the defender again this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: hala,
        weapon1: [zenithBlade],
        hand: [cutNCarveRed, andAgainBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: kassai, hand: [aMomentSPeaceBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(hala);
    const Kassai = game.as(kassai);

    Hala.activate(zenithBlade);
    game.advanceUntil({ stopAt: "defend" });
    Kassai.defendWith(aMomentSPeaceBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Kassai).toHaveLife(19); // 3 vs 2{d}

    // Attacking Kassai again with the same sword is now illegal.
    expectFabUnplayable(
      () =>
        Hala.play(andAgainBlue, {
          target: Hala.cardIn("weapon1", zenithBlade).instanceId,
        }),
      /attack|legal|restrict/i,
    );
    expectFabPlayer(Kassai).toHaveLife(19);
  });

  it("boundary: without the block, the same sword may attack again this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: hala,
        weapon1: [zenithBlade],
        hand: [cutNCarveRed, andAgainBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: kassai, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(hala);
    const Kassai = game.as(kassai);

    Hala.play(cutNCarveRed); // sharpen the sword
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: zenithBlade.canonicalId });
    Hala.activate(zenithBlade);
    game.advanceUntil({ stopAt: "defend" });
    Kassai.defendWith(nimblismBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Kassai).toHaveLife(18); // sharpened 4 vs 2{d}

    Hala.play(andAgainBlue, {
      target: Hala.cardIn("weapon1", zenithBlade).instanceId,
    });
    game.advanceUntil({ stopAt: "defend" });
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Kassai).toHaveLife(14); // second sharpened 4{p} attack lands
  });

  it("timing: still defends for its printed 2{d} against non-sword attacks with no restriction", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: kassai, hand: [aMomentSPeaceBlue], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Kassai = game.as(kassai);

    Dash.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    Kassai.defendWith(aMomentSPeaceBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Kassai).toHaveLife(18); // 4 vs 2{d}
    expectFabCard(Kassai, aMomentSPeaceBlue).toBeIn("graveyard");
  });
});
