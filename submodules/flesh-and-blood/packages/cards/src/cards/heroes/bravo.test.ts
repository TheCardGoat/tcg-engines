import { describe, expect, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { bravo } from "./bravo.ts";
import { anothos } from "../weapons/anothos.ts";
import { disableRed } from "../actions/disable.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { regurgitatingSlogRed } from "../actions/regurgitating-slog.ts";
import { concealedObjectBlue } from "../instants/concealed-object.ts";

/**
 * Hero behavior acceptance test — Bravo (BVO002).
 *
 * Implements the per-hero AAA requirements from HEROES.md:
 * - Core mechanic: cost-3+ attack actions gain dominate after activation
 * - Core interaction: dominate enforced (rejects multi-card defense)
 * - Boundaries: cost-2 no-dominate, go-again AP refund, until-EOT expiry,
 *   weapon attack exclusion (Anothos signature weapon)
 *
 * Signature weapon: Anothos (BVO003)
 */

const opponentHero = dash;

// ---------------------------------------------------------------------------
// bravo (BVO002) — Guardian/Young — 20hp
// Printed: "Action - {r}{r}: Until end of turn, your attack action cards with
// cost 3 or more get dominate. Go again"
// ---------------------------------------------------------------------------

describe("bravo (BVO002)", () => {
  it("boundaries: hero defaults to 20 life (Young health boundary)", () => {
    const game = FabTestEngine.start({ hero: bravo, deck: 6 }, { hero: opponentHero, deck: 6 });
    expectFabPlayer(game.as(bravo)).toHaveLife(20);
  });

  it("core mechanic: cost-3+ attack actions gain dominate after hero activation", () => {
    // Arrange — disable-red is a Guardian Action Attack with cost 5.
    // Give bravo 7 resource points (2 for activation + 5 for disable-red).
    const game = FabTestEngine.start(
      { hero: bravo, hand: [disableRed], deck: 6, resourcePoints: 7 },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const _Opponent = game.as(opponentHero);

    // Act — activate bravo's hero ability (BVO002-a1), then attack.
    Bravo.must.activate(bravo);
    game.passBoth();

    // Attack with disable-red (cost 5 ≥ 3 threshold).
    Bravo.attackWith(disableRed);

    // Assert — the combat chain link carries dominate.
    expectCombat(game).toHaveKeyword("dominate");
  });

  it("boundaries: a cost-2 attack action does NOT gain dominate after activation", () => {
    // Arrange — regurgitating-slog-red is a Generic Action Attack with cost 2.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [regurgitatingSlogRed], deck: 6, resourcePoints: 4 },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const _Opponent = game.as(opponentHero);

    // Act — activate bravo's hero ability, then attack with the cost-2 card.
    Bravo.must.activate(bravo);
    game.passBoth();

    Bravo.attackWith(regurgitatingSlogRed);

    // Assert — dominate is NOT granted because cost 2 < 3 threshold.
    expectCombat(game).notToHaveKeyword("dominate");
  });

  it("core interaction: dominate granted by the ability rejects a two-hand-card defense", () => {
    // Arrange — disable-red (cost 5 ≥ 3) plus resources for the activation and
    // the attack. Opponent holds two hand cards so dominate must reject the
    // two-card defense at the Defend step.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [disableRed], deck: 6, resourcePoints: 7 },
      { hero: opponentHero, life: 20, hand: [snatchRed, nimblismBlue], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const _Opponent = game.as(opponentHero);

    // Act — activate BVO002-a1, resolve the ability layer.
    Bravo.must.activate(bravo);
    game.passBoth();

    // Attack with disable-red.
    Bravo.attackWith(disableRed);

    // Assert — the cost-5 attack carries dominate, and a defense using both
    // hand cards is rejected with the dominate error code.
    expectCombat(game).toHaveKeyword("dominate");
    expect(game.as(opponentHero).expectBlockRejected([snatchRed, nimblismBlue]).errorCode).toBe(
      "dominate",
    );
  });

  it("boundaries: the ability's go again refunds the action point (net AP cost 0)", () => {
    // Arrange — bravo with default AP (1) and resources for the 2-cost activation.
    const game = FabTestEngine.start(
      { hero: bravo, deck: 6, resourcePoints: 2 },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const _Opponent = game.as(opponentHero);

    // Act — activate BVO002-a1 and resolve the ability layer.
    Bravo.must.activate(bravo);
    game.passBoth();

    // Assert — start 1 AP, −1 to activate, +1 from go again = net 0 → back to 1.
    expect(Bravo.actionPoints()).toBe(1);
  });

  it("boundaries: the dominate grant expires at end of turn", () => {
    // Arrange — turn 1 activates the ability without attacking. Turn 2 attacks
    // with the same disable-red without re-activating; dominate must be gone.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [disableRed, nimblismBlue, concealedObjectBlue],
        deck: 6,
        resourcePoints: 2,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(opponentHero);

    // Act (turn 1) — activate BVO002-a1, resolve, then end turn.
    Bravo.must.activate(bravo);
    game.passBoth();

    Bravo.endTurn();
    Opponent.endTurn();

    // Act (turn 2) — attack with disable-red without re-activating.
    Bravo.must.pitch(nimblismBlue).pitch(concealedObjectBlue).playAttack(disableRed);

    // Assert — dominate grant expired at end of turn 1.
    expectCombat(game).notToHaveKeyword("dominate");
  });

  it("signature weapon: Anothos (BVO003) can attack and its attack is excluded from the dominate grant", () => {
    // Anothos is Bravo's signature weapon — a 2H Guardian Hammer.
    // The hero ability grants dominate to "attack action cards with cost 3 or
    // more." Anothos is a Weapon (not an Action Attack) so the continuous
    // filter must not stamp dominate on weapon attacks.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [anothos],
        resourcePoints: 5, // 2 for BVO002-a1 + 3 for Anothos attack
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const _Opponent = game.as(opponentHero);

    // Act — grant dominate via hero ability, then attack with Anothos.
    Bravo.must.activate(bravo);
    game.passBoth();

    Bravo.must.activate(anothos);
    game.passBoth();

    // Assert — Anothos opens combat but the weapon attack does NOT carry
    // dominate (which only applies to Action Attack cards).
    expectCombat(game).toBeOpen().notToHaveKeyword("dominate");
  });
});
