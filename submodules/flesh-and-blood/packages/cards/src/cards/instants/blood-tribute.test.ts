import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { levia } from "../heroes/levia.ts";
import { crackedBaubleYellow } from "../resources/cracked-bauble.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { bloodTributeRed } from "./blood-tribute.ts";

describe("Blood Tribute family AAA", () => {
  it("happy: the red printing opts three cards then banishes the kept top card", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [bloodTributeRed],
        actionPoints: 1,
        deckTop: [brutalAssaultBlue, nimblismBlue, crackedBaubleYellow, snatchRed],
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Levia = game.as(levia);

    Levia.play(bloodTributeRed);
    game.helpers.resolveUntilIdle();

    expectFabCard(Levia, snatchRed).toBeBanished();
    expect(Levia.cardsIn("deck", crackedBaubleYellow)).toHaveLength(1);
    expectFabCard(Levia, bloodTributeRed).toBeIn("graveyard");
  });

  it("boundary: putting the looked cards on bottom banishes the new top", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [bloodTributeRed],
        actionPoints: 1,
        deckTop: [brutalAssaultBlue, nimblismBlue, crackedBaubleYellow, snatchRed],
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Levia = game.as(levia);

    Levia.play(bloodTributeRed, { optBottom: 3 });
    game.helpers.resolveUntilIdle();

    expectFabCard(Levia, brutalAssaultBlue).toBeBanished();
    expect(Levia.cardsIn("deck", snatchRed)).toHaveLength(1);
    expectFabCard(Levia, bloodTributeRed).toBeIn("graveyard");
  });

  it("timing: the red printing can be played as an instant during combat", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: levia, hand: [bloodTributeRed], deckTop: [nimblismBlue, crackedBaubleYellow] },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Levia = game.as(levia);

    Dash.playAttack(snatchRed);
    game.toReaction("defender");
    Levia.play(bloodTributeRed);
    game.helpers.resolveUntilIdle();

    expect(Levia.zone("banished")).toHaveLength(1);
    expectFabCard(Levia, bloodTributeRed).toBeIn("graveyard");
    expectFabPlayer(Levia).toHaveLife(16);
  });
});
