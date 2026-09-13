import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
  fabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { chane } from "../heroes/chane.ts";
import { dash } from "../heroes/dash.ts";
import { unboundByShadowRed } from "../actions/unbound-by-shadow.ts";

/**
 * Gate to i'Arathael (IAR222) — Shadow Token - Aura.
 *
 * Printed: "Instant - {r}, destroy this: You may play target action card with
 * blood debt from your banished zone this turn."
 *
 * The token instance rides `token:gate-to-i-arathael`; the module is
 * registered in packages/engine/src/testing/token-registry.ts. Unbound by
 * Shadow (IAR178) is the blood-debt action under the grant: unlike Bounding
 * Demigon / Seeds of Agony it carries no banished-origin permission leg of its
 * own, so the gate's grant is what makes it playable from the banished zone.
 */

describe("Gate to i'Arathael (IAR222) AAA", () => {
  it("happy: destroying the gate permits playing the targeted blood-debt action from the banished zone", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        arena: [fabToken("gate-to-i-arathael")],
        banished: [unboundByShadowRed],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.activate(fabToken("gate-to-i-arathael"));
    Chane.target(unboundByShadowRed);
    game.helpers.untilIdle({ optionals: "accept", ordering: "listed" });

    // The gate paid for the permission with its own destruction; a token that
    // leaves the arena ceases to exist.
    expectFabToken(game, "gate-to-i-arathael").toHaveCount(0);

    Chane.playAttack(unboundByShadowRed, { from: "banished", stopAt: "on-attack" });
    expectCombat(game).toBeOpen().toHaveAttackPower(4);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabCard(Chane, unboundByShadowRed).toBeIn("graveyard");
  });

  it("boundary: declining the target still destroys the gate but grants no permission", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        arena: [fabToken("gate-to-i-arathael")],
        banished: [unboundByShadowRed],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    // CR 1.8.5e: "may ... target" is declined by declaring no target when the
    // activated layer is created.
    Chane.activate(fabToken("gate-to-i-arathael"));
    Chane.target();
    game.helpers.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabToken(game, "gate-to-i-arathael").toHaveCount(0);

    Chane.expectActivationRejected(unboundByShadowRed);
    expectFabCard(Chane, unboundByShadowRed).toBeBanished();
    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });

  it("boundary: a permission created on the opponent's turn expires at that turn boundary", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        arena: [fabToken("gate-to-i-arathael")],
        banished: [unboundByShadowRed],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Dash.pass();
    Chane.activate(fabToken("gate-to-i-arathael"));
    Chane.target(unboundByShadowRed);
    game.helpers.untilIdle({ optionals: "accept", ordering: "listed" });

    // The permission belongs to the current turn, even though the non-active
    // player created it. It must not become a next-turn setup effect.
    Dash.endTurn();
    Chane.expectActivationRejected(unboundByShadowRed);
    expectFabCard(Chane, unboundByShadowRed).toBeBanished();
  });
});
