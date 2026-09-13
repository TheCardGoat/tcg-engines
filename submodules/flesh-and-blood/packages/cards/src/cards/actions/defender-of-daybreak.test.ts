import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { boltyn } from "../heroes/boltyn.ts";
import { bravo } from "../heroes/bravo.ts";
import { lunartidePlundererBlue } from "./lunartide-plunderer.ts";
import { snatchRed } from "./snatch.ts";
import { defenderOfDaybreakRed } from "./defender-of-daybreak.ts";

/**
 * Defender of Daybreak, Red (DTD094) — Light Action Attack, 4{p}/2{d}.
 * Printed: When this defends a Shadow attack, non-equipment Light cards get
 * +1{d} this combat chain.
 */

describe("Defender of Daybreak (DTD094) AAA", () => {
  it("happy: defending a Shadow attack grants this +1{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [lunartidePlundererBlue], deck: 6, resourcePoints: 3 },
      { hero: boltyn, hand: [defenderOfDaybreakRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    game.as(bravo).playAttack(lunartidePlundererBlue);
    Boltyn.defendWith(defenderOfDaybreakRed);
    game.passBoth();

    expectFabCard(Boltyn, defenderOfDaybreakRed).toHaveDefense(3);
    expectCombat(game).toBeOpen();
  });

  it("boundary: defending a non-Shadow attack stays printed 2{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: boltyn, hand: [defenderOfDaybreakRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    game.as(bravo).playAttack(snatchRed);
    Boltyn.defendWith(defenderOfDaybreakRed);
    game.passBoth();

    expectFabCard(Boltyn, defenderOfDaybreakRed).toHaveDefense(2);
  });

  it("timing: the +1{d} expires when the combat chain closes", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [lunartidePlundererBlue, snatchRed],
        deck: 6,
        resourcePoints: 3,
      },
      { hero: boltyn, hand: [defenderOfDaybreakRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Boltyn = game.as(boltyn);

    Bravo.playAttack(lunartidePlundererBlue);
    Boltyn.defendWith(defenderOfDaybreakRed);
    game.passBoth();
    expectFabCard(Boltyn, defenderOfDaybreakRed).toHaveDefense(3);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectCombat(game).toBeClosed();
    expectFabPlayer(Boltyn).toHaveLife(18);
  });
});
