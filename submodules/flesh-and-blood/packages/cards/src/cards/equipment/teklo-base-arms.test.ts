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
import { tekloBaseArms } from "./teklo-base-arms.ts";

describe("Teklo Base Arms (EVO020) AAA", () => {
  it("happy: defending with this 1{d} Arms destroys it when the chain closes", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: teklovossen,
        arms: [tekloBaseArms],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    expectFabCard(Teklo, tekloBaseArms).toHaveKeyword("blade-break");
    game.as(bravo).playAttack(snatchRed);
    Teklo.defendWith(tekloBaseArms);
    game.untilIdle({ optionals: "decline" });

    expectFabPlayer(Teklo).toHaveLife(17);
    expectFabCard(Teklo, tekloBaseArms).toBeIn("graveyard");
  });

  it("boundary: this stays equipped in arms when it does not defend", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: teklovossen,
        arms: [tekloBaseArms],
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
    expectFabCard(Teklo, tekloBaseArms).toBeIn("arms");
  });

  it("timing: Blade Break destroys this at chain close, not when it is declared as a defender", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: teklovossen,
        arms: [tekloBaseArms],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    game.as(bravo).playAttack(snatchRed);
    Teklo.defendWith(tekloBaseArms);

    expectCombat(game).toBeOpen();
    expectFabCard(Teklo, tekloBaseArms).toBeIn("combatChain");

    game.closeCombat({ optionals: "decline" });

    expectCombat(game).toBeClosed();
    expectFabCard(Teklo, tekloBaseArms).toBeIn("graveyard");
  });
});
