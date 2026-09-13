/**
 * IAR222 Gate to I'Arathael — Shadow Token Aura.
 *
 * Printed:
 *   a1: Instant - {r}, destroy this: You may play target action card with
 *       blood debt from your banished zone this turn.
 *
 * Status: ✅ — target declaration, activation costs, both optional-target
 * branches, exact-object permission, normal timing/costs, turn expiry, and
 * snapshot restoration are proven through the public driver.
 */
import { describe, expect, it } from "vitest";

import { battlefieldBreakerBlue } from "../../../../cards/src/cards/actions/battlefield-breaker.ts";
import { wallBreakerRed } from "../../../../cards/src/cards/actions/wall-breaker.ts";
import { gateToIArathael } from "../../../../cards/src/cards/tokens/gate-to-i-arathael.ts";
import {
  createFabMatchContext,
  FabTestEngine,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "../../index.ts";
import { boundingDemigonRed, bravo, dash, nimblismBlue, snatchRed } from "../../rules/fixtures.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

function restore(game: FabTestEngine): FabTestEngine {
  const state = game.getState();
  return FabTestEngine.fromState(
    restoreFabMatchSnapshot(
      serializeFabMatchSnapshot(state),
      createFabMatchContext(state.cardDefinitions, state.publicCardIdentities),
    ),
  );
}

describe("Gate to I'Arathael token (IAR222)", () => {
  it("card loads in arena", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [gateToIArathael], deck: 8 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("arena")).toContain(gateToIArathael.canonicalId);
  });

  it("a1: declares the exact target before paying, survives restore, then preserves normal play costs", () => {
    let game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [gateToIArathael],
        banished: [wallBreakerRed, battlefieldBreakerBlue],
        hand: [nimblismBlue, nimblismBlue, snatchRed, snatchRed],
        arsenal: [snatchRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 8,
      },
      { hero: dash, deck: 8 },
      manual,
    );
    let Bravo = game.as(bravo);

    expect(Bravo.handCount()).toBe(4);
    expect(Bravo.zone("arsenal")).toEqual([snatchRed.canonicalId]);

    game.exec({
      move: "activate",
      actorId: Bravo.id,
      payload: { instanceId: Bravo.ref(gateToIArathael).instanceId },
    });
    const target = Bravo.expectDecision("entity-target");
    expect(target.min).toBe(0);
    expect(target.max).toBe(1);
    expect(target.candidates).toHaveLength(2);
    // CR 5.2.2b / 5.1.4: target declaration precedes both activation costs.
    expect(Bravo.resourcePoints()).toBe(3);
    expect(Bravo.zone("arena")).toContain(gateToIArathael.canonicalId);

    game = restore(game);
    Bravo = game.as(bravo);
    Bravo.chooseTargets(wallBreakerRed);

    expect(Bravo.resourcePoints()).toBe(2);
    expect(Bravo.zone("arena")).not.toContain(gateToIArathael.canonicalId);
    // As a token, destroyed Gate ceases to exist rather than remaining in the
    // graveyard (CR 3.0.12a).
    expect(Bravo.zone("graveyard")).not.toContain(gateToIArathael.canonicalId);

    // The restored harness uses its normal public auto-pass policy, so
    // answering the target resolves the otherwise response-free layer.
    expect(game.getState().decision).toBeNull();

    // The chosen-object permission itself is persisted, not reconstructed
    // from a card name or broad blood-debt filter after restore.
    game = restore(game);
    Bravo = game.as(bravo);
    const unselected = Bravo.expectFailure({
      move: "begin-play",
      payload: {
        instanceId: Bravo.ref(battlefieldBreakerBlue).instanceId,
        from: "banished",
      },
    });
    expect(unselected.errorCode).toBe("unsupported_play_permission");

    const played = Bravo.play(wallBreakerRed, { from: "banished" });
    expect(played.accepted).toBe(true);
    // Gate changes only the origin. Wall Breaker still pays its printed 2{r}
    // and the ordinary Action cost (CR 5.1.6-5.1.9).
    expect(Bravo.resourcePoints()).toBe(0);
    expect(Bravo.actionPoints()).toBe(0);
    expect(Bravo.zone("banished")).not.toContain(wallBreakerRed.canonicalId);
    expect(Bravo.zone("combatChain")).toContain(wallBreakerRed.canonicalId);
  });

  it("a1 optional decline still pays {r} and destroys Gate but grants no play permission", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [gateToIArathael],
        banished: [wallBreakerRed],
        hand: [nimblismBlue, nimblismBlue, snatchRed, snatchRed],
        arsenal: [snatchRed],
        resourcePoints: 3,
        deck: 8,
      },
      { hero: dash, deck: 8 },
      manual,
    );
    const Bravo = game.as(bravo);

    game.exec({
      move: "activate",
      actorId: Bravo.id,
      payload: { instanceId: Bravo.ref(gateToIArathael).instanceId },
    });
    const optionalTarget = Bravo.expectDecision("entity-target");
    expect(optionalTarget).toMatchObject({ min: 0, max: 1 });
    Bravo.chooseTargets();
    expect(Bravo.resourcePoints()).toBe(2);
    expect(Bravo.zone("arena")).not.toContain(gateToIArathael.canonicalId);
    expect(Bravo.zone("graveyard")).not.toContain(gateToIArathael.canonicalId);

    game.passBoth();
    expect(game.getState().decision).toBeNull();

    const rejected = Bravo.expectFailure({
      move: "begin-play",
      payload: { instanceId: Bravo.ref(wallBreakerRed).instanceId, from: "banished" },
    });
    expect(rejected.errorCode).toBe("unsupported_play_permission");
    expect(Bravo.resourcePoints()).toBe(2);
    expect(Bravo.zone("banished")).toContain(wallBreakerRed.canonicalId);
  });

  it("a1 does not bypass Action timing and its unused permission expires with the turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [nimblismBlue, nimblismBlue, snatchRed, snatchRed],
        arsenal: [snatchRed],
        deck: 8,
      },
      {
        hero: dash,
        arena: [gateToIArathael],
        banished: [wallBreakerRed],
        hand: [nimblismBlue, nimblismBlue, snatchRed, snatchRed],
        arsenal: [snatchRed],
        resourcePoints: 3,
        deck: 8,
      },
      manual,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Bravo is turn-player. Passing gives Dash an instant window for Gate.
    Bravo.pass();
    game.exec({
      move: "activate",
      actorId: Dash.id,
      payload: { instanceId: Dash.ref(gateToIArathael).instanceId },
    });
    Dash.chooseTargets(wallBreakerRed);
    game.passBoth();
    expect(game.getState().decision).toBeNull();

    if (!Dash.hasPriority()) Bravo.pass();
    const wrongTurn = Dash.expectFailure({
      move: "begin-play",
      payload: { instanceId: Dash.ref(wallBreakerRed).instanceId, from: "banished" },
    });
    expect(wrongTurn.errorCode).toBe("illegal_action_timing");

    // CR 1.11.4a / 4.3.4: with the stack empty and no combat chain, Dash's
    // pass completes the pass cycle opened by Bravo's pass above, so the Action
    // Phase ends here (end phase + draw to hand size) and the end-turn move is
    // no longer legal for Bravo.
    Dash.pass();
    expect(Dash.hasPriority()).toBe(true);
    const expired = Dash.expectFailure({
      move: "begin-play",
      payload: { instanceId: Dash.ref(wallBreakerRed).instanceId, from: "banished" },
    });
    expect(expired.accepted).toBe(false);
  });

  it("a1 boundary: cannot activate without enough resources or pitch", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [gateToIArathael],
        banished: [boundingDemigonRed],
        hand: [],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false },
    );
    const rejection = game.as(bravo).expectActivationRejected(gateToIArathael);

    expect(rejection.errorCode).toBe("insufficient_activation_assets");
    expect(game.as(bravo).zone("arena")).toContain(gateToIArathael.canonicalId);
  });
});
