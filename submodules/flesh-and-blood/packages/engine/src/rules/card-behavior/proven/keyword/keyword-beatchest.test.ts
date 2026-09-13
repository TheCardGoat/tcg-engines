/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: keyword:beatChest
 * Representative card: packages/cards/src/cards/actions/bare-destruction.ts
 * Canonical id: CWcTdDfFHrQjKz8dLqfTp
 *
 * Arrange: import the representative real card and establish a legal,
 * player-reachable match state with the required heroes, zones, resources,
 * targets, counters, and opponent responses.
 * Act: dispatch only production FabTestEngine moves (play, pitch, defend,
 * resolve prompts, pass priority, and end the relevant phase).
 * Assert: verify player-visible outcomes such as life, zones, AP/resources,
 * combat state, prompts, legality error codes, or game result. Include the
 * negative/boundary case and any timing or interaction case before completion.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabCard, expectFabPlayer } from "../../../../index.ts";
import { bravo, dash, heartOfFyendal } from "../../../fixtures.ts";
import { bareDestructionRed } from "../../../../../../cards/src/cards/actions/bare-destruction.ts";
import { regurgitatingSlogRed } from "../../../../../../cards/src/cards/actions/regurgitating-slog.ts";

describe("keyword: beatChest", () => {
  it("AAA happy — beating chest discards the chosen 6+ power card and powers the chest reward (CR 8.3.33)", () => {
    // Arrange — Bare Destruction costs 2; Regurgitating Slog (power 6) both
    // pitches and serves as the beat chest discard.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [bareDestructionRed, regurgitatingSlogRed], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      // Walks priority/pitch timing by hand so AP survives past combat close.
      { autoPassPriority: false, autoPitch: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const slogId = Bravo.findCardInZone("hand", regurgitatingSlogRed);

    // Act — pay the resource cost, then the optional beat chest cost.
    Bravo.must
      .pitch(regurgitatingSlogRed)
      .playAttack(bareDestructionRed, { beatChest: true, beatChestInstanceId: slogId });
    game.helpers.resolveRestOfCombat();

    // Assert — slog is discarded (8.3.33a), the 6-power attack hits, and the
    // beaten-chest condition grants Bare Destruction go again (no chest
    // equipment controlled) leaving an action point.
    expectFabCard(Bravo, regurgitatingSlogRed).toBeIn("graveyard");
    expectCombat(game).toBeClosed();
    expectFabPlayer(Dash).toHaveLife(14); // 20 − 6
    expectFabPlayer(Bravo).toHaveAP(1);
  });

  it("AAA boundary — skipping beat chest keeps the hand intact and grants no go again (CR 8.3.33)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [bareDestructionRed, regurgitatingSlogRed], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.must.pitch(regurgitatingSlogRed).playAttack(bareDestructionRed);
    game.helpers.resolveRestOfCombat();

    // Slog is not discarded (stays available), and no beaten-chest status
    // means no conditional go again is granted.
    expectFabCard(Bravo, regurgitatingSlogRed).toBeIn("hand");
    expectFabPlayer(Dash).toHaveLife(14);
    expectFabPlayer(Bravo).toHaveAP(0);
  });

  it("AAA boundary — beat chest cannot discard a card with less than 6 power (CR 8.3.33b)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [bareDestructionRed, regurgitatingSlogRed, heartOfFyendal],
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false },
    );
    const Bravo = game.as(bravo);
    const fyendalId = Bravo.findCardInZone("hand", heartOfFyendal);

    const rejection = Bravo.expectFailure({
      move: "begin-play",
      payload: {
        instanceId: Bravo.findCardInZone("hand", bareDestructionRed),
        beatChest: true,
        beatChestInstanceId: fyendalId,
      },
    });
    expect(rejection.errorCode).toBe("additional_cost_failed");
    expect(Bravo.zone("hand")).toContain(heartOfFyendal.canonicalId);
  });
});
