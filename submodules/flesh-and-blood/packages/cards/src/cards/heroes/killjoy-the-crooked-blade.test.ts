import { describe, it } from "vitest";
import {
  expectFabPlayer,
  expectFabCard,
  expectCombat,
  expectWait,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { concealedObjectBlue } from "../instants/concealed-object.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { gold } from "../tokens/gold.ts";
import { killjoyTheCrookedBlade } from "./killjoy-the-crooked-blade.ts";
import { cutpurseRapier } from "../weapons/cutpurse-rapier.ts";

/**
 * Killjoy, the Crooked Blade (SPW001) — Reviled Warrior Thief Hero - Young.
 *
 * Printed:
 *   You may attack any opposing hero.        (1v1-only product: this clause
 *   cannot manifest — gap attack/additional-hero-target-1v1)
 *   Whenever you steal a Gold, the crowd boos you.
 *   The first time the crowd boos you each turn, each hero with more {h} than
 *   you loses 1{h}.
 *
 * Steal-to-boo is exercised below through real Cutpurse hits, contrasting
 * an opposing Gold with an arena containing no Gold.
 */

describe("Killjoy, the Crooked Blade (SPW001) AAA", () => {
  it("happy: hitting a hero with Cutpurse Rapier steals a Gold they control", () => {
    const game = FabTestEngine.start(
      {
        hero: killjoyTheCrookedBlade,
        weapon1: [cutpurseRapier],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        life: 18,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        arena: [gold],
        hand: [],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Killjoy = game.as(killjoyTheCrookedBlade);
    const Dash = game.as(dash);

    Killjoy.activateAttack(cutpurseRapier);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Killjoy).toHaveTokenCount("gold", 1);
    expectFabPlayer(Dash).toHaveTokenCount("gold", 0).toHaveLife(17); // 3{p} hit
  });

  it("happy: the crowd booing Killjoy drains each richer hero by 1{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: killjoyTheCrookedBlade,
        hand: [concealedObjectBlue],
        resourcePoints: 1,
        actionPoints: 1,
        life: 18,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        hand: [],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Killjoy = game.as(killjoyTheCrookedBlade);
    const Dash = game.as(dash);

    Killjoy.play(concealedObjectBlue); // the crowd boos you
    game.untilIdle({ optionals: "throw" });

    expectFabPlayer(Killjoy).toHaveCrowdBooedThisTurn();
    expectFabPlayer(Dash).toHaveLife(19); // 20 > 18, loses 1{h}
    expectFabPlayer(Killjoy).toHaveLife(18);
  });

  it("boundary: only the first boo each turn drains the richer hero", () => {
    const game = FabTestEngine.start(
      {
        hero: killjoyTheCrookedBlade,
        hand: [concealedObjectBlue, concealedObjectBlue],
        resourcePoints: 1,
        actionPoints: 2,
        life: 18,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        hand: [],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Killjoy = game.as(killjoyTheCrookedBlade);
    const Dash = game.as(dash);

    Killjoy.play(concealedObjectBlue);
    game.untilIdle({ optionals: "throw" });
    expectFabPlayer(Dash).toHaveLife(19);

    Killjoy.play(concealedObjectBlue);
    game.untilIdle({ optionals: "throw" });
    expectFabPlayer(Dash).toHaveLife(19); // second boo drains nobody
  });
});

for (const [opponentLife, afterBoo] of [
  [17, 17],
  [18, 18],
  [19, 18],
] as const) {
  it(`Killjoy's first boo at 18 life compares strictly against ${opponentLife}`, () => {
    const game = FabTestEngine.start(
      {
        hero: killjoyTheCrookedBlade,
        hand: [concealedObjectBlue, snatchRed],
        life: 18,
        resourcePoints: 0,
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        hand: [],
        life: opponentLife,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Killjoy = game.as(killjoyTheCrookedBlade);
    const Dash = game.as(dash);
    Killjoy.play(concealedObjectBlue);
    game.untilIdle({ optionals: "throw" });
    expectFabPlayer(Killjoy).toHaveLife(18).toHaveCrowdBooedThisTurn();
    expectFabPlayer(Dash).toHaveLife(afterBoo).notToHaveCrowdBooedThisTurn();
    expectFabCard(Killjoy, concealedObjectBlue).toBeIn("arena");
    Killjoy.playAttack(snatchRed);
    game.closeCombat({ optionals: "throw" });
    expectFabPlayer(Dash).toHaveLife(afterBoo - 4);
    expectFabPlayer(Killjoy).toHaveLife(18).toHaveAP(0);
    expectCombat(game).toBeClosed();
    expectWait(game).toBeIdle();
  });
}

it("Killjoy's first-boo life loss resets on the opposing turn", () => {
  const padding = () => Array.from({ length: 10 }, () => nimblismBlue);
  const game = FabTestEngine.start(
    {
      hero: killjoyTheCrookedBlade,
      hand: [concealedObjectBlue, concealedObjectBlue],
      life: 18,
      resourcePoints: 0,
      deck: padding(),
    },
    { hero: dash, hand: [snatchRed], life: 21, resourcePoints: 0, deck: padding() },
    FAB_MANUAL_HARNESS,
  );
  const Killjoy = game.as(killjoyTheCrookedBlade);
  const Dash = game.as(dash);
  Killjoy.play(concealedObjectBlue);
  game.untilIdle({ optionals: "throw" });
  expectFabPlayer(Dash).toHaveLife(20);
  expectFabPlayer(Killjoy).toHaveLife(18).toHaveCrowdBooedThisTurn();
  Killjoy.endTurn();
  game.untilIdle({ optionals: "throw" });
  expectFabPlayer(Killjoy).notToHaveCrowdBooedThisTurn();
  Dash.pass();
  Killjoy.play(concealedObjectBlue);
  game.untilIdle({ optionals: "throw" });
  expectFabPlayer(Dash).toHaveLife(19);
  expectFabPlayer(Killjoy).toHaveLife(18).toHaveCrowdBooedThisTurn();
  Dash.playAttack(snatchRed);
  game.closeCombat({ optionals: "throw" });
  expectFabPlayer(Killjoy).toHaveLife(14);
  expectFabPlayer(Dash).toHaveLife(19).toHaveAP(0);
  expectCombat(game).toBeClosed();
  expectWait(game).toBeIdle();
});

for (const hasGold of [true, false]) {
  it(`Killjoy steals and boos only when Cutpurse can take Gold: ${hasGold}`, () => {
    const game = FabTestEngine.start(
      {
        hero: killjoyTheCrookedBlade,
        weapon1: [cutpurseRapier],
        hand: [],
        resourcePoints: 1,
        life: 18,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        arena: hasGold ? [gold] : [],
        hand: [],
        life: 24,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Killjoy = game.as(killjoyTheCrookedBlade);
    const Dash = game.as(dash);
    Killjoy.activateAttack(cutpurseRapier);
    game.closeCombat({ optionals: "throw" });
    expectFabPlayer(Killjoy)
      .toHaveTokenCount("gold", hasGold ? 1 : 0)
      .toHaveLife(18)
      .toHaveAP(0)
      .toHaveResourceCount(0);
    expectFabPlayer(Dash)
      .toHaveTokenCount("gold", 0)
      .toHaveLife(hasGold ? 20 : 21)
      .notToHaveCrowdBooedThisTurn();
    if (hasGold) expectFabPlayer(Killjoy).toHaveCrowdBooedThisTurn();
    else expectFabPlayer(Killjoy).notToHaveCrowdBooedThisTurn();
    expectCombat(game).toBeClosed();
    expectWait(game).toBeIdle();
  });
}

it("Only the stealing Killjoy is booed when both heroes are Killjoy", () => {
  const game = FabTestEngine.start(
    {
      hero: killjoyTheCrookedBlade,
      weapon1: [cutpurseRapier],
      hand: [],
      resourcePoints: 1,
      life: 24,
      deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
    },
    {
      hero: killjoyTheCrookedBlade,
      arena: [gold],
      hand: [],
      life: 18,
      deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
    },
    FAB_MANUAL_HARNESS,
  );
  const Thief = game.as(killjoyTheCrookedBlade, 1);
  const Victim = game.as(killjoyTheCrookedBlade, 2);
  Thief.activateAttack(cutpurseRapier);
  game.closeCombat({ optionals: "throw" });
  expectFabPlayer(Thief)
    .toHaveTokenCount("gold", 1)
    .toHaveLife(24)
    .toHaveCrowdBooedThisTurn()
    .toHaveAP(0);
  expectFabPlayer(Victim).toHaveTokenCount("gold", 0).toHaveLife(15).notToHaveCrowdBooedThisTurn();
  expectCombat(game).toBeClosed();
  expectWait(game).toBeIdle();
});
