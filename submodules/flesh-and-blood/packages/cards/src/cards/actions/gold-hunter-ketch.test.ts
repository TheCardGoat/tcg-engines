import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { gold } from "../tokens/gold.ts";
import { marlynn } from "../heroes/marlynn.ts";
import { goldHunterKetchYellow } from "./gold-hunter-ketch.ts";

/**
 * Gold Hunter Ketch, Yellow (SEA165) — Pirate Attack Action.
 *
 * Printed: "If you control less Gold than an opponent, this costs {r}{r} less
 * to play." (cost 4, 7{p}, 2{d})
 */

describe("Gold Hunter Ketch (SEA165) AAA", () => {
  it("happy: controlling less Gold than the opponent reduces the cost by 2{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: marlynn,
        hand: [goldHunterKetchYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arena: [gold], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Marlynn = game.as(marlynn);

    Marlynn.attackWith(goldHunterKetchYellow);
    expectCombat(game).toHaveAttackPower(7);
    expectFabPlayer(Marlynn).toHaveResourceCount(0);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(13);
  });

  it("boundary: with equal Gold, 2{r} cannot pay the printed 4{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: marlynn,
        hand: [goldHunterKetchYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Marlynn = game.as(marlynn);

    expect(() => Marlynn.attackWith(goldHunterKetchYellow)).toThrow();
    expectFabCard(Marlynn, goldHunterKetchYellow).toBeIn("hand");
  });

  it("timing: paying the printed 4{r} with equal Gold still attacks at 7{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: marlynn,
        hand: [goldHunterKetchYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Marlynn = game.as(marlynn);

    Marlynn.attackWith(goldHunterKetchYellow);
    expectCombat(game).toHaveAttackPower(7);
    expectFabPlayer(Marlynn).toHaveResourceCount(0);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(13);
  });
});
