/**
 * CRU075 Zen State — CR 8.6.5.
 *
 * Public oracle:
 * - Twelve Petal Kāṣāya creates the token through its legal Instant ability.
 * - The token enters with 1 balance counter.
 * - Only the beginning of its controller's action phase removes that counter;
 *   the following controller action phase destroys the token.
 * - Its fixed prevention applies independently to both arcane and physical
 *   damage events without consuming the token or its balance counter.
 */
import { describe, expect, it } from "vitest";
import { runechant } from "../../../../cards/src/cards/tokens/runechant.ts";
import { twelvePetalKYa } from "../../../../cards/src/cards/equipment/twelve-petal-k-ya.ts";
import { expectFabCard, FabTestEngine, fabToken } from "../../index.ts";
import { bravo, dash, nimblismBlue, snatchRed } from "../../rules/fixtures.ts";

const zenState = fabToken("zen-state");

function createZenState(options?: { readonly withDamageSource?: boolean }) {
  const game = FabTestEngine.start(
    {
      hero: bravo,
      chest: [twelvePetalKYa],
      chiPoints: 3,
      deck: 8,
    },
    {
      hero: dash,
      hand: options?.withDamageSource ? [snatchRed, nimblismBlue, nimblismBlue, nimblismBlue] : [],
      arena: options?.withDamageSource ? [runechant] : [],
      deck: 8,
    },
    { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
  );
  const Bravo = game.as(bravo);

  Bravo.activate(twelvePetalKYa);
  game.helpers.resolveUntilIdle();

  return { game, Bravo, Dash: game.as(dash), token: Bravo.cardIn("arena", zenState) };
}

describe("Zen State token (CRU075)", () => {
  it("enters with exactly 1 balance counter through a legal token-creation ability", () => {
    const { Bravo, token } = createZenState();

    expectFabCard(Bravo, token).toBeIn("arena").toHaveCounters(1, "balance");
    expect(Bravo.zone("chest")).not.toContain(twelvePetalKYa.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(twelvePetalKYa.canonicalId);
  });

  it("ignores the opponent's action phase, then removes-or-destroys on successive controller action phases", () => {
    const { game, Bravo, Dash, token } = createZenState();

    Bravo.endTurn();
    expectFabCard(Bravo, token).toBeIn("arena").toHaveCounters(1, "balance");

    Dash.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    expectFabCard(Bravo, token).toBeIn("arena").toHaveCounters(0, "balance");

    Bravo.endTurn();
    expectFabCard(Bravo, token).toBeIn("arena").toHaveCounters(0, "balance");

    Dash.endTurn();
    game.helpers.resolveUntilIdle();
    expect(Bravo.cardsIn("arena", zenState)).toHaveLength(0);
    expect(Bravo.zone("graveyard")).not.toContain(zenState.canonicalId);
  });

  it("lets the controller decline the available counter removal and destroy the token", () => {
    const { game, Bravo, Dash, token } = createZenState();

    Bravo.endTurn();
    expectFabCard(Bravo, token).toBeIn("arena").toHaveCounters(1, "balance");

    Dash.endTurn();
    game.passBoth();
    Bravo.chooseBoolean(false);
    game.helpers.resolveUntilIdle();

    expect(Bravo.cardsIn("arena", zenState)).toHaveLength(0);
    expect(Bravo.zone("graveyard")).not.toContain(zenState.canonicalId);
  });

  it("prevents 1 from each arcane and physical damage event after its balance counter is gone", () => {
    const { game, Bravo, Dash, token } = createZenState({ withDamageSource: true });
    const lifeBefore = Bravo.life();

    Bravo.endTurn();
    Dash.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    expectFabCard(Bravo, token).toBeIn("arena").toHaveCounters(0, "balance");

    Bravo.endTurn();
    Dash.attackWith(snatchRed);

    // Runechant's separate 1 arcane damage packet is fully prevented.
    expect(Bravo.life()).toBe(lifeBefore);
    expectFabCard(Bravo, token).toBeIn("arena").toHaveCounters(0, "balance");

    Bravo.defendWith([]);
    game.helpers.resolveRestOfCombat();

    // Snatch's 4 physical damage is reduced to 3 by a fresh fixed-prevention event.
    expect(Bravo.life()).toBe(lifeBefore - 3);
    expectFabCard(Bravo, token).toBeIn("arena").toHaveCounters(0, "balance");
  });
});
