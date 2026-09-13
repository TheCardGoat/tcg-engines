import { describe, expect, it } from "vitest";
import { FabTestEngine, fabToken } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { seepingShadowsYellow } from "./seeping-shadows.ts";
import { snatchRed } from "./snatch.ts";
import { craneDanceRed } from "./crane-dance.ts";
import { soulbeadStrikeRed } from "./soulbead-strike.ts";
import { findCenterBlue } from "./find-center.ts";

/**
 * Find Center (CRU054) — Ninja Action - Attack, cost 0, power 2, def 3.
 *
 * Printed text (i18n, source of truth):
 * "Combo - If Crane Dance was the last attack this combat chain, Find Center
 * can't be defended by cards with {r} cost less than the number of chain
 * links you control, and it gains "If this hits, create a Zen State token.""
 *
 * /fab-rules Mode B handoff (behavior constraints):
 * - Combo gate: the defend restriction and the on-hit Zen State token both
 *   apply only when Crane Dance was the immediately preceding attack this
 *   combat chain.
 * - Restriction: defender cards with resource cost < the controller's chain
 *   links are illegal; cost >= links remains legal.
 * - The Zen State token creation is hit-gated (CR 7.2).
 *
 * Module verdict: the authored conditional `rule-modification restrict
 * defend cost < chain-links` + on-hit `create-token zen-state` implement
 * the printed behavior faithfully.
 *
 * Engine note: combo links are chained on an OPEN combat chain —
 * play -> passBoth -> advanceCombatTo("resolution") -> next attack —
 * mirroring the engine's combo suite. A full resolveUntilIdle between
 * links would close the chain and disarm the combo gate (Crane Dance then
 * resolves at plain 3{p}). Bravo seats the board so no hero passive
 * injects decisions at hit steps.
 */

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

const ZEN = fabToken("zen-state").canonicalId;

/**
 * Seat the armed combo on an open chain:
 * Soulbead Strike (link 1, 4 dmg) then Crane Dance (link 2, 4 dmg via combo).
 */
function playArmedChain(game: ReturnType<typeof FabTestEngine.start>) {
  const Bravo = game.as(bravo);
  Bravo.playAttack(soulbeadStrikeRed); // Link 1: 4 damage.
  game.passBoth();
  game.advanceCombatTo("resolution");
  Bravo.playAttack(craneDanceRed); // Link 2: 3 + combo 1 = 4 damage.
  game.passBoth();
  game.advanceCombatTo("resolution");
  return Bravo;
}

describe("Find Center (CRU054) AAA", () => {
  it("combo: third link resolves at plain 2{p} and its hit creates a Zen State token", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [soulbeadStrikeRed, craneDanceRed, findCenterBlue],
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Dash = game.as(dash);
    const Bravo = playArmedChain(game);

    Bravo.playAttack(findCenterBlue); // Link 3: combo armed (Crane Dance was last).
    game.passBoth();
    game.advanceCombatTo("resolution"); // 2 damage + on-hit Zen State token.
    game.helpers.resolveUntilIdle(); // Drain reactions and close the chain.

    // Soulbead 4 + Crane 4 + Find Center 2: Dash 20 -> 10.
    expect(Dash.life()).toBe(10);
    // The hit trigger created exactly one Zen State token under the controller's control.
    expect(Bravo.zone("arena").filter((id) => id === ZEN).length).toBe(1);
    expect(Bravo.zone("graveyard")).toContain(findCenterBlue.canonicalId);
  });

  it("combo restriction: cost < chain links (3) is illegal; cost >= links blocks legally and the miss births no token", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [soulbeadStrikeRed, craneDanceRed, findCenterBlue],
        actionPoints: 3,
        deck: 6,
      },
      // Snatch costs 0 (< 3 links: illegal); Seeping Shadows costs 3 (= links: legal, 2{d}).
      { hero: dash, hand: [snatchRed, seepingShadowsYellow], deck: 6 },
      manual,
    );
    const Dash = game.as(dash);
    const Bravo = playArmedChain(game);

    Bravo.playAttack(findCenterBlue); // Link 3: combo armed.
    game.advanceCombatTo("defend");
    const rejection = Dash.expectBlockRejected(snatchRed);
    expect(rejection.errorCode).toBe("restricted_by_rule");

    // The cost-3 defender is legal and blocks out the 2{p} attack (2 - 2 = 0).
    Dash.defendWith(seepingShadowsYellow);
    game.helpers.resolveUntilIdle();

    expect(Dash.life()).toBe(12); // 20 - 4 - 4 - 0
    // No hit: the token trigger never fired.
    expect(Bravo.zone("arena").filter((id) => id === ZEN).length).toBe(0);
  });

  it("boundary: without Crane Dance in the chain, the cost-0 defender is legal and no token appears", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [findCenterBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [snatchRed], deck: 6 },
      manual,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Bravo.playAttack(findCenterBlue); // Link 1: no combo — restriction disarmed.
    game.advanceCombatTo("defend");
    Dash.defendWith(snatchRed); // Cost 0 would be illegal under an armed combo.
    game.helpers.resolveUntilIdle();

    // 2{p} fully blocked by 2{d}: no damage, no hit, no token.
    expect(Dash.life()).toBe(20);
    expect(Bravo.zone("arena").filter((id) => id === ZEN).length).toBe(0);
  });
});
