import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fang } from "../heroes/fang.ts";
import { obsidianFireVein } from "../weapons/obsidian-fire-vein.ts";
import { quicksilverDagger } from "../weapons/quicksilver-dagger.ts";
import { longWhiskerLoyaltyRed } from "./long-whisker-loyalty.ts";

/**
 * Long Whisker Loyalty (HNT102) — Draconic Warrior Attack Reaction, cost 0, 3{d}.
 *
 * Printed: For each Draconic chain link you control, choose 1;
 *   Target dagger attack gains +2{p}.
 *   You may attack with target dagger an additional time this turn.
 *   The next time target dagger hits a hero this turn, mark them.
 */

describe("Long Whisker Loyalty (HNT102) AAA", () => {
  it("happy: one Draconic chain link can choose +2{p} on the dagger", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [longWhiskerLoyaltyRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.must.activate(obsidianFireVein);
    game.advanceCombatTo("reaction");
    Fang.must.playReaction(longWhiskerLoyaltyRed, {
      modeIds: ["969HqThPzMmQtFhM9mNq8:chooseForEachDraconicLink:boostDagger"],
    });
    game.passBoth();

    expectCombat(game).toHaveAttackPower(3);
    expectFabCard(Fang, longWhiskerLoyaltyRed).toBeIn("graveyard");
  });

  it("happy: mark mode marks the defending hero when the dagger hits", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [longWhiskerLoyaltyRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);
    const Dash = game.as(dash);

    Fang.must.activate(obsidianFireVein);
    game.advanceCombatTo("reaction");
    Fang.must.playReaction(longWhiskerLoyaltyRed, {
      modeIds: ["969HqThPzMmQtFhM9mNq8:chooseForEachDraconicLink:markOnNextHit"],
    });
    game.passBoth();
    expectFabPlayer(Dash).notToBeMarked();

    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toBeMarked();
  });

  it("boundary: a non-Draconic dagger attack gets no +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [quicksilverDagger],
        hand: [longWhiskerLoyaltyRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.must.activate(quicksilverDagger);
    game.advanceCombatTo("reaction");
    Fang.must.playReaction(longWhiskerLoyaltyRed, {
      modeIds: ["969HqThPzMmQtFhM9mNq8:chooseForEachDraconicLink:boostDagger"],
    });
    game.passBoth();

    expectCombat(game).toHaveAttackPower(1);
    expectFabCard(Fang, longWhiskerLoyaltyRed).toBeIn("graveyard");
  });

  it("timing: extra-activation mode lets the dagger attack a second time this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [longWhiskerLoyaltyRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.must.activate(obsidianFireVein);
    game.advanceCombatTo("reaction");
    const reactionId = Fang.findCardInZone("hand", longWhiskerLoyaltyRed);
    game.playInstance(
      Fang.id,
      reactionId,
      {
        modeIds: ["969HqThPzMmQtFhM9mNq8:chooseForEachDraconicLink:additionalDaggerAttack"],
      },
      "explicit",
    );
    game.passBoth();
    Fang.accept();
    game.helpers.resolveUntilIdle();

    Fang.must.activate(obsidianFireVein);
    game.advanceCombatTo("defend");
    expectCombat(game).toBeOpen();
  });
});
