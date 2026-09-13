import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { lungingPressBlue } from "../attack-reactions/lunging-press.ts";
import { clipFlexor } from "./clip-flexor.ts";

/**
 * Clip Flexor (MPW138) — Generic Arms d0.
 * Printed: "Defense Reaction - Destroy this: You may add an attack reaction
 * card from your hand to the active chain link as a defending card."
 */

describe("Clip Flexor (MPW138) AAA", () => {
  it("happy: destroying this adds the hand attack reaction as a defending card", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        arms: [clipFlexor],
        hand: [lungingPressBlue],
        life: 20,
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    // Defense Reaction window — the defender activates from the arms slot.
    game.toReaction("defender");
    Bravo.activate(clipFlexor);
    // "You may add an attack reaction card from your hand" — accept and name it.
    game.untilIdle({ optionals: "accept", entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Bravo, clipFlexor).toBeIn("graveyard");

    // 4{p} versus Lunging Press's 2{d} as a defending card.
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Bravo).toHaveLife(18);
    expectFabCard(Bravo, lungingPressBlue).toBeIn("graveyard");
  });

  it("boundary: declining the optional keeps the reaction in hand and the full hit lands", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        arms: [clipFlexor],
        hand: [lungingPressBlue],
        life: 20,
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    game.toReaction("defender");
    Bravo.activate(clipFlexor);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });

    // The destroy-self cost still happened.
    expectFabCard(Bravo, clipFlexor).toBeIn("graveyard");
    expectFabCard(Bravo, lungingPressBlue).toBeIn("hand");

    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Bravo).toHaveLife(16); // full 4{p}
  });
});
