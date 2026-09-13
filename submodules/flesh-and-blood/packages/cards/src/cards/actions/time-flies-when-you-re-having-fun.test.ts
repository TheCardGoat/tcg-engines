import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { timeFliesWhenYouReHavingFunRed } from "./time-flies-when-you-re-having-fun.ts";

describe("Time Flies When You're Having Fun (SUP220) AAA", () => {
  it("happy: the next AAC hit may destroy an aura they control", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [timeFliesWhenYouReHavingFunRed, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arena: [fabToken("ponder")], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(timeFliesWhenYouReHavingFunRed);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(snatchRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, ordering: "listed" });

    expectFabToken(game, "ponder").toHaveCount(0);
    expectFabCard(Bravo, timeFliesWhenYouReHavingFunRed).toBeIn("graveyard");
  });

  it("boundary: declining the destroy leaves their aura", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [timeFliesWhenYouReHavingFunRed, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arena: [fabToken("ponder")], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(timeFliesWhenYouReHavingFunRed);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(snatchRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, ordering: "listed" });
    expectFabToken(game, "ponder").toHaveCount(1);
  });

  it("timing: from arsenal the next AAC gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        arsenal: [timeFliesWhenYouReHavingFunRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(timeFliesWhenYouReHavingFunRed, { from: "arsenal" });
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Bravo).toHaveAP(1);
    Bravo.playAttack(snatchRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(7);
  });
});
