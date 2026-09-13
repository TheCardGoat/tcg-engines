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
import { tekloBaseChest } from "./teklo-base-chest.ts";

describe("Teklo Base Chest (EVO019) AAA", () => {
  it("happy: defending with this 1{d} Chest destroys it when the chain closes", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: teklovossen,
        chest: [tekloBaseChest],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    expectFabCard(Teklo, tekloBaseChest).toHaveKeyword("blade-break");
    game.as(bravo).playAttack(snatchRed);
    Teklo.defendWith(tekloBaseChest);
    game.untilIdle({ optionals: "decline" });

    expectFabPlayer(Teklo).toHaveLife(17);
    expectFabCard(Teklo, tekloBaseChest).toBeIn("graveyard");
  });

  it("boundary: this stays equipped in chest when it does not defend", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: teklovossen,
        chest: [tekloBaseChest],
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
    expectFabCard(Teklo, tekloBaseChest).toBeIn("chest");
  });

  it("timing: Blade Break destroys this at chain close, not when it is declared as a defender", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: teklovossen,
        chest: [tekloBaseChest],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    game.as(bravo).playAttack(snatchRed);
    Teklo.defendWith(tekloBaseChest);

    expectCombat(game).toBeOpen();
    expectFabCard(Teklo, tekloBaseChest).toBeIn("combatChain");

    game.closeCombat({ optionals: "decline" });

    expectCombat(game).toBeClosed();
    expectFabCard(Teklo, tekloBaseChest).toBeIn("graveyard");
  });
});
