import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { snatchRed, snatchYellow, snatchBlue } from "../actions/snatch.ts";
import { hunterOrHuntedBlue } from "./hunter-or-hunted.ts";

/**
 * Hunter or Hunted? Blue (SUP245) — Assassin Defense Reaction.
 *
 * Printed: When this defends, name a card. The attacking hero reveals the top
 * card of their deck. If it's the named card, banish it, search their hand,
 * deck, and arsenal for up to 3 cards with that name and banish them, then
 * they shuffle.
 * Contract — While this is defending, you are contracted to banish opponents'
 * cards with the chosen name. Whenever you complete this contract, create a
 * Silver token.
 *
 * Name-a-card is the public `effect-resolution` closed list (CR 8.5.21);
 * `.choose(printedName)` answers it. Naming the revealed deck-top banishes
 * that card and extra copies. Test catalog names are the seated identities
 * ("Snatch", "Dash"), not i18n punctuation.
 */

function defendWithHunter(
  game: FabTestEngine,
  Dash: ReturnType<FabTestEngine["as"]>,
  Arakni: ReturnType<FabTestEngine["as"]>,
): void {
  Dash.playAttack(snatchRed);
  game.toReaction("defender");
  Arakni.must.playReaction(hunterOrHuntedBlue);
  game.passBoth();
  Arakni.decline();
  game.passBoth();
  game.passBoth();
}

describe("Hunter or Hunted? (SUP245) AAA", () => {
  it("happy: naming the revealed deck-top banishes it and extra copies", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed, snatchBlue],
        actionPoints: 1,
        deck: 6,
        deckTop: [snatchYellow],
      },
      { hero: arakni, hand: [hunterOrHuntedBlue], resourcePoints: 3, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Arakni = game.as(arakni);

    defendWithHunter(game, Dash, Arakni);
    expectWait(game).toHaveDecision("effect-resolution");
    Arakni.choose("Snatch");
    game.passBoth();

    expectFabCard(Dash, snatchYellow).toBeBanished();
    expectFabCard(Dash, snatchBlue).toBeBanished();
    expectFabCard(Arakni, hunterOrHuntedBlue).toBeIn("combatChain");
    expectFabPlayer(Arakni).toHaveTokenCount("silver", 1);
    expectFabPlayer(Dash).toHaveLife(20);
    game.helpers.expectLog("flesh-and-blood.name-card", {
      playerId: Arakni.id,
      cardName: "Snatch",
    });
  });

  it("boundary: naming a miss leaves the revealed card in the deck and creates no Silver", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
        deckTop: [snatchYellow],
      },
      { hero: arakni, hand: [hunterOrHuntedBlue], resourcePoints: 3, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Arakni = game.as(arakni);

    defendWithHunter(game, Dash, Arakni);
    expectWait(game).toHaveDecision("effect-resolution");
    Arakni.choose("Dash");
    game.closeCombat();

    expect(Dash.zone("deck")).toContain(snatchYellow.canonicalId);
    expect(Dash.zone("banished")).toHaveLength(0);
    expectFabPlayer(Arakni).toHaveTokenCount("silver", 0);
    expectCombat(game).toBeClosed();
  });

  it("timing: cannot play Hunter or Hunted? outside the reaction step", () => {
    const game = FabTestEngine.start(
      { hero: arakni, hand: [hunterOrHuntedBlue], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabUnplayable(
      () => game.as(arakni).play(hunterOrHuntedBlue),
      /not legal in the current reaction step/i,
    );
    expectFabCard(game.as(arakni), hunterOrHuntedBlue).toBeIn("hand");
  });
});
