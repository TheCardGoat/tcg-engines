import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { nimblismBlue } from "./nimblism.ts";
import { soulbeadStrikeRed } from "./soulbead-strike.ts";
import { craneDanceRed } from "./crane-dance.ts";
import { snatchRed } from "./snatch.ts";

/**
 * Crane Dance (CRU057) — Ninja Action - Attack, cost 0, power 3, def 3.
 *
 * Printed text (i18n, source of truth):
 * "Combo - If Soulbead Strike was the last attack this combat chain, Crane
 * Dance gains +1{p}, go again, and it can't be defended by attack action
 * cards with base {p} greater than the number of chain links you control."
 *
 * /fab-rules Mode B handoff (behavior constraints):
 * - Combo gate: +1{p}, go again, and the defend restriction apply only when
 *   Soulbead Strike was the immediately preceding attack this combat chain.
 * - Restriction: defender ATTACK ACTION cards with base power > the
 *   controller's chain links are illegal; non-attack defenders remain legal.
 * - No card-level go again: without the combo gate the spent action point
 *   stays spent.
 *
 * Module verdict: the authored conditional sequence (+1 power, grant go
 * again, rule-modification restrict base power > chain-links) implements the
 * printed behavior faithfully.
 *
 * Engine note: combo links are chained on an OPEN combat chain — play ->
 * passBoth -> advanceCombatTo("resolution") -> next attack — mirroring the
 * engine's combo suite. Bravo seats the board so no hero passive injects
 * decisions at hit steps.
 */

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

/** Seat the armed combo on an open chain: Soulbead Strike (link 1). */
function playSoulbeadLead(game: ReturnType<typeof FabTestEngine.start>) {
  const Bravo = game.as(bravo);
  Bravo.playAttack(soulbeadStrikeRed); // Link 1: 4 damage, go again printed.
  game.passBoth();
  game.advanceCombatTo("resolution");
  return Bravo;
}

describe("Crane Dance (CRU057) AAA", () => {
  it("combo: after Soulbead Strike, Crane Dance enters at 4{p} with go again and refunds its action point", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [soulbeadStrikeRed, craneDanceRed], actionPoints: 2, deck: 6 },
      { hero: dash, deck: 6 },
      manual,
    );
    const Dash = game.as(dash);
    const Bravo = playSoulbeadLead(game);

    Bravo.playAttack(craneDanceRed); // Link 2: combo armed.
    game.passBoth();
    const link = game.combat()?.activeLink;
    expect(link?.attackPower).toBe(4); // 3 + combo 1.
    expect(link?.keywords ?? []).toContain("go-again");

    game.resolveCombatNoReactions();
    // Soulbead 4 + Crane 4: Dash 20 -> 12.
    expect(Dash.life()).toBe(12);
    // Soulbead's own go again and the combo go-again both refund: 2 AP spent,
    // 2 refunded — the chain nets back to the starting budget.
    expect(Bravo.actionPoints()).toBe(2);
  });

  it("restriction: base {p} 4 attack action can't defend 2 links; a non-attack action still blocks", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [soulbeadStrikeRed, craneDanceRed], actionPoints: 2, deck: 6 },
      // Brutal Assault: attack action, base 4{p} (> 2 links: illegal).
      // Nimblism: NON-attack action, 2{d} (restriction only binds attack actions).
      { hero: dash, hand: [brutalAssaultBlue, nimblismBlue], deck: 6 },
      manual,
    );
    const Dash = game.as(dash);
    const Bravo = playSoulbeadLead(game);

    Bravo.playAttack(craneDanceRed); // Link 2: combo armed, 2 chain links.
    game.advanceCombatTo("defend");

    const rejection = Dash.expectBlockRejected(brutalAssaultBlue);
    expect(rejection.errorCode).toBe("restricted_by_rule");

    // The non-attack action defends legally and chips the 4{p} down to 2.
    Dash.defendWith(nimblismBlue);
    game.helpers.resolveUntilIdle();

    expect(Dash.life()).toBe(14); // 20 - 4 (Soulbead) - (4 - 2).
  });

  it("combo restriction is scoped to Crane Dance itself: later links allow the same defenders", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [soulbeadStrikeRed, craneDanceRed, snatchRed],
        actionPoints: 3,
        deck: 6,
      },
      // Brutal Assault: attack action, base 4{p}. Three chain links means it
      // would be illegal (4 > 3) IF the combo restriction leaked past its
      // own attack; the printed "it can't be defended by…" binds Crane Dance.
      { hero: dash, hand: [brutalAssaultBlue], deck: 6 },
      manual,
    );
    const Dash = game.as(dash);
    const Bravo = playSoulbeadLead(game);

    Bravo.playAttack(craneDanceRed); // Link 2: combo armed, restriction latched.
    game.passBoth();
    game.resolveCombatNoReactions(); // Combo go again refunds the action point.

    // Link 3: a fresh attack with the combo restriction still live this turn.
    // Defending IT with the same 4{p} attack action is legal — the
    // restriction died with Crane Dance's window, it is not game-level.
    Bravo.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(brutalAssaultBlue);
    game.helpers.resolveUntilIdle();

    expect(Dash.life()).toBe(11); // 20 - 4 (Soulbead) - 4 (Crane) - (4{p} - 3{d}).
  });

  it("boundary: solo Crane Dance (no combo) stays 3{p}, has no go again, and keeps the action point spent", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [craneDanceRed], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      manual,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Bravo.playAttack(craneDanceRed); // Fresh chain: combo gate NOT armed.
    game.passBoth();
    const link = game.combat()?.activeLink;
    expect(link?.attackPower).toBe(3); // Plain printed power.
    expect(link?.keywords ?? []).not.toContain("go-again");

    game.resolveCombatNoReactions();
    expect(Dash.life()).toBe(17); // 20 - 3.
    expect(Bravo.actionPoints()).toBe(0); // No refund without the combo.
  });
});
