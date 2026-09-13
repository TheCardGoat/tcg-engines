/**
 * Gold sample for the fluent FAB test layer (docs/fluent-test-api-plan.md).
 *
 * Uses only real catalog cards (src/rules/fixtures.ts) and production moves.
 * Locks the card-ref rule table: unique-def resolution, not-found, ambiguity,
 * captured refs, must-verb rejection, visibility projection, and one
 * before/after AAA scenario.
 */
import { describe, expect, it } from "vite-plus/test";
import {
  FabAmbiguousCardRefError,
  FabCardRefNotFoundError,
  FabMoveFailedError,
  FabTestEngine,
  expectFabCard,
} from "../index.ts";
import { bravo, dash, nimblismBlue, snatchRed } from "../rules/fixtures.ts";
import { iyslander } from "../../../cards/src/cards/heroes/iyslander.ts";
import { aetherAshwing } from "../../../cards/src/cards/tokens/aether-ashwing.ts";
import { succumbToWinterBlue } from "../../../cards/src/cards/actions/succumb-to-winter.ts";

describe("fluent card refs", () => {
  it("resolves a card definition when exactly one matching instance exists", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, deck: 6 },
    );
    const Bravo = game.as(bravo);

    const ref = Bravo.cardIn("hand", snatchRed);
    expect(ref.kind).toBe("instance");
    expect(ref.canonicalId).toBe(snatchRed.canonicalId);
    expect(ref.ownerId).toBe(Bravo.id);
    expect(Bravo.cardsIn("hand", snatchRed)).toHaveLength(1);
    // Full-scope resolution finds the same instance.
    expect(Bravo.ref(snatchRed).instanceId).toBe(ref.instanceId);
    expectFabCard(Bravo, snatchRed).notToHaveKeyword("go-again");
  });

  it("throws FabCardRefNotFoundError when zero instances match", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, deck: 6 },
    );
    const Bravo = game.as(bravo);

    expect(() => Bravo.cardIn("hand", nimblismBlue)).toThrow(FabCardRefNotFoundError);
    expect(() => Bravo.ref(nimblismBlue)).toThrow(FabCardRefNotFoundError);
    expect(Bravo.cardsIn("hand", nimblismBlue)).toHaveLength(0);
  });

  it("throws FabAmbiguousCardRefError for two copies without a filter (count + zone)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed, snatchRed], deck: 6 },
      { hero: dash, deck: 6 },
    );
    const Bravo = game.as(bravo);

    expect(() => Bravo.ref(snatchRed)).toThrow(FabAmbiguousCardRefError);
    expect(() => Bravo.cardIn("hand", snatchRed)).toThrow(/2 instances \(2 in hand\)/);
    expect(() => Bravo.ref(snatchRed)).toThrow(/capture a ref/);
  });

  it("disambiguates multiples with refs captured from queries and acts", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed, snatchRed], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: true },
    );
    const Bravo = game.as(bravo);
    const copies = Bravo.cardsIn("hand", snatchRed);
    expect(copies).toHaveLength(2);

    // Playing one captured ref leaves the other uniquely resolvable in hand.
    const played = Bravo.must.playAttack(copies[0]!);
    const remaining = Bravo.cardIn("hand", snatchRed);
    expect(remaining.instanceId).toBe(copies[1]!.instanceId);
    expect(remaining.instanceId).not.toBe(played.instanceId);

    // No blockers is an explicit defense declaration; auto-pass then resolves
    // the response-free combat window. The played copy lands in the graveyard
    // while the captured twin stays in hand.
    game.passBoth();
    expectFabCard(Bravo, played).toBeIn("graveyard");
    expectFabCard(Bravo, remaining).toBeIn("hand");
  });
});

describe("fluent arsenal targets", () => {
  it("plays an arsenal card against a unique public opposing target by card reference", () => {
    const game = FabTestEngine.start(
      // A matching private card must not make the public target shorthand
      // ambiguous or expose it to the arsenal player (CR 3.0.3, 3.0.4).
      { hero: bravo, hand: [aetherAshwing], arena: [aetherAshwing], deck: 6 },
      { hero: iyslander, arsenal: [succumbToWinterBlue], resourcePoints: 3, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Iyslander = game.as(iyslander);

    Bravo.pass();
    expect(Iyslander.hasPriority()).toBe(true);
    Iyslander.playFromArsenal(succumbToWinterBlue, [aetherAshwing]);

    expect(Iyslander.zone("arsenal")).not.toContain(succumbToWinterBlue.canonicalId);
  });
});

describe("fluent card face assertions", () => {
  it("toBeFaceUp / toBeFaceDown follow the face-down marker and fail on the opposite face", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        arsenal: [{ card: nimblismBlue, state: { faceDown: true } }],
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Bravo = game.as(bravo);

    expectFabCard(Bravo, snatchRed).toBeFaceUp();
    expectFabCard(Bravo, nimblismBlue).toBeFaceDown();

    expect(() => expectFabCard(Bravo, nimblismBlue).toBeFaceUp()).toThrow();
    expect(() => expectFabCard(Bravo, snatchRed).toBeFaceDown()).toThrow();
  });

  it("face/ready assertions fail on a missing object record instead of silently passing", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, deck: 6 },
    );
    const Bravo = game.as(bravo);
    // A capture that outlives its object (token/Macro/ephemeral ceasing to
    // exist) resolves to no record; the assertions must fail, never fall
    // back to "not face-down => face up passes". Simulate the ceasing object
    // by dropping its record after the capture is taken.
    const captured = expectFabCard(Bravo, snatchRed);
    const instanceId = Bravo.findCardInZone("hand", snatchRed);
    delete (game.getState().objects as Record<string, unknown>)[instanceId];
    expect(() => captured.toBeFaceUp()).toThrow(/no longer exists/);
    expect(() => captured.toBeFaceDown()).toThrow(/no longer exists/);
    expect(() => captured.toBeReady()).toThrow(/no longer exists/);
  });
});

describe("fluent must verbs", () => {
  it("throw FabMoveFailedError when the production move is rejected", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, hand: [nimblismBlue], deck: 6 },
    );
    const Dash = game.as(dash);

    // No combat is open — declaring defenders is rejected (expectFailure style:
    // the probe rejects with a rules error code and the must verb throws).
    const rejection = Dash.expectFailure({
      move: "defend",
      payload: { instanceIds: [Dash.cardIn("hand", nimblismBlue).instanceId] },
    });
    expect(rejection.errorCode).toBe("not_defend_step");

    let caught: unknown;
    try {
      Dash.must.defend(nimblismBlue);
    } catch (error) {
      caught = error;
    }
    expect(caught).toBeInstanceOf(FabMoveFailedError);
    expect((caught as FabMoveFailedError).result.errorCode).toBe("not_defend_step");
    // The rejected declaration did not move the card.
    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
  });
});

describe("visibility projection", () => {
  it("assertCardHiddenFrom / assertCardVisibleTo follow the viewer projection", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, hand: [nimblismBlue], deck: 6 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Opponent hands are hidden from each other; owners see their own.
    game.assertCardHiddenFrom(Bravo, nimblismBlue, Dash);
    game.assertCardHiddenFrom(Dash, snatchRed, Bravo);
    game.assertCardVisibleTo(Dash, nimblismBlue, Dash);
    game.assertCardVisibleTo(Bravo, snatchRed, Bravo);
  });
});

describe("AAA scenario (before/after gold sample)", () => {
  it("bravo attacks with snatch red, dash defends, damage hits", () => {
    // Arrange — real heroes and catalog cards only.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, hand: [nimblismBlue], deck: 6 },
      { autoPassPriority: true },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Act — intent verbs: play to Defend, block, close combat.
    const attack = Bravo.cardIn("hand", snatchRed);
    Bravo.playAttack(snatchRed);
    Dash.defendWith(nimblismBlue);
    game.closeCombat();

    // Assert — rules-visible results: damage, zones, combat state.
    game.helpers.expectPlayer(Dash).toHaveLife(18); // 20 − (4 power − 2 defense)
    expectFabCard(Bravo, attack).toBeIn("graveyard");
    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
    game.helpers.expectCombat().toBeClosed();
    // Snatch red: "When this hits, draw a card."
    game.helpers.expectPlayer(Bravo).toHaveHandCount(1);
  });
});
