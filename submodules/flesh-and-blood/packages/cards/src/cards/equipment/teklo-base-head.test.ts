import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { tekloBaseHead } from "./teklo-base-head.ts";

describe("Teklo Base Head (EVO018) AAA", () => {
  it("happy: defending with this 1{d} Head destroys it when the chain closes", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: teklovossen,
        head: [tekloBaseHead],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    expectFabCard(Teklo, tekloBaseHead).toHaveKeyword("blade-break");
    game.as(bravo).playAttack(snatchRed);
    Teklo.defendWith(tekloBaseHead);
    game.untilIdle({ optionals: "decline" });

    expectFabPlayer(Teklo).toHaveLife(17);
    expectFabCard(Teklo, tekloBaseHead).toBeIn("graveyard");
  });

  it("boundary: this stays equipped in head when it does not defend", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: teklovossen,
        head: [tekloBaseHead],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    game.as(bravo).playAttack(snatchRed);
    Teklo.defendWith();
    game.untilIdle({ optionals: "decline" });

    expectFabPlayer(Teklo).toHaveLife(16);
    expectFabCard(Teklo, tekloBaseHead).toBeIn("head");
  });

  it("timing: Blade Break destroys this at chain close, not when it is declared as a defender", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: teklovossen,
        head: [tekloBaseHead],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    game.as(bravo).playAttack(snatchRed);
    Teklo.defendWith(tekloBaseHead);

    expectCombat(game).toBeOpen();
    expectFabCard(Teklo, tekloBaseHead).toBeIn("combatChain");

    game.closeCombat({ optionals: "decline" });

    expectCombat(game).toBeClosed();
    expectFabCard(Teklo, tekloBaseHead).toBeIn("graveyard");
  });
});
