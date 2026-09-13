import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { marlynn } from "../heroes/marlynn.ts";
import { rustyHarpoonBlue } from "./rusty-harpoon.ts";
import { deathDealer } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { bigGameTrophyShotYellow } from "./big-game-trophy-shot.ts";

/**
 * Big Game Trophy Shot (SEA087) — Pirate Ranger Action, cost 2, go again.
 *
 * Printed: Your next arrow attack this turn gets +4{p}. If it has harpoon in
 * its name, it gets "When this hits a hero, create a Gold token." Draw a
 * card, then discard a card. Go again
 *
 * The +4 arrow latch and draw/discard are public. The Harpoon Gold rider
 * binds discarded `it` (the draw/discard card) instead of the next arrow, so
 * a Rusty Harpoon hit creates no Gold — pin, do not half-fix.
 */

describe("Big Game Trophy Shot (SEA087) AAA", () => {
  it("happy: the next arrow gets +4{p}, draw-then-discard resolves, and go again refunds AP", () => {
    const game = FabTestEngine.start(
      {
        hero: marlynn,
        hand: [bigGameTrophyShotYellow],
        weapon1: [deathDealer],
        arsenal: [{ card: rustyHarpoonBlue, state: { faceDown: true } }],
        resourcePoints: 2,
        actionPoints: 1,
        deckTop: [nimblismBlue],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Marlynn = game.as(marlynn);

    Marlynn.play(bigGameTrophyShotYellow);
    game.untilIdle({ entityTargets: "minimum" });
    expectFabPlayer(Marlynn).toHaveAP(1);
    expectFabCard(Marlynn, nimblismBlue).toBeIn("graveyard");

    Marlynn.attackWith(rustyHarpoonBlue, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(game.as(dash)).toHaveLife(15);
    expectFabToken(game, "gold").toHaveCount(1);
  });

  it("boundary: a non-arrow attack gets no +4{p} and creates no Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: marlynn,
        hand: [bigGameTrophyShotYellow, snatchRed],
        resourcePoints: 2,
        actionPoints: 2,
        deckTop: [nimblismBlue],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Marlynn = game.as(marlynn);

    Marlynn.play(bigGameTrophyShotYellow);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: nimblismBlue.canonicalId });

    Marlynn.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabToken(game, "gold").toHaveCount(0);
  });

  it("timing: a Harpoon hit creates a Gold token", () => {
    const game = FabTestEngine.start(
      {
        hero: marlynn,
        hand: [bigGameTrophyShotYellow],
        weapon1: [deathDealer],
        arsenal: [{ card: rustyHarpoonBlue, state: { faceDown: true } }],
        resourcePoints: 2,
        actionPoints: 1,
        deckTop: [nimblismBlue],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Marlynn = game.as(marlynn);

    Marlynn.play(bigGameTrophyShotYellow);
    game.untilIdle({ entityTargets: "minimum" });
    expectFabToken(game, "gold").toHaveCount(0);

    Marlynn.attackWith(rustyHarpoonBlue, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabToken(game, "gold").toHaveCount(1);
  });
});
