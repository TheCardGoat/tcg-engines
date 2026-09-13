/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: keyword:usurp
 * Representative card: packages/cards/src/cards/actions/sinspeaker-gloomblade.ts
 * Canonical id: cPH6KbH6PDWmjq68jdFjb
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
import { FabTestEngine, expectCombat, expectFabPlayer } from "../../../../index.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { sinspeakerGloombladeRed } from "../../../../../../cards/src/cards/actions/sinspeaker-gloomblade.ts";
import { runechant } from "../../../../../../cards/src/cards/tokens/runechant.ts";
import { gateToIArathael } from "../../../../../../cards/src/cards/tokens/gate-to-i-arathael.ts";

describe("keyword: usurp", () => {
  it("UST notes: destroying a Runechant pays Usurp for +2{p} and that Runechant does not trigger", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [sinspeakerGloombladeRed], arena: [runechant], deck: 4 },
      { hero: dash, hand: [], life: 20, arena: [gateToIArathael], deck: 4 },
      { autoPassPriority: false },
    );
    const player = game.as(bravo);
    player.play(sinspeakerGloombladeRed);
    player.target(runechant);
    game.advanceUntil({ stopAt: "defend" });
    expect(player.zone("arena")).not.toContain(runechant.canonicalId);
    expectCombat(game).toHaveAttackPower(4);
    expect(game.as(dash).zone("arena")).toContain(gateToIArathael.canonicalId);
    game.closeCombat();
    // Printed 2{p} + Usurp 2{p} = 4. The destroyed Runechant does not deal its
    // "when you play an attack action" 1 arcane (life would be 15 if it had).
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("UST notes: a public opposing Runechant can pay Usurp", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [sinspeakerGloombladeRed], deck: 4 },
      { hero: dash, hand: [], life: 20, arena: [runechant], deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    Bravo.play(sinspeakerGloombladeRed);
    Bravo.target(runechant);
    game.advanceUntil({ stopAt: "defend" });
    expect(game.as(dash).zone("arena")).not.toContain(runechant.canonicalId);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("UST notes: with no Runechant the card is still playable and gets no +2{p}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [sinspeakerGloombladeRed], deck: 4 },
      { hero: dash, hand: [], life: 20, deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    Bravo.play(sinspeakerGloombladeRed);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(2);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(18);
  });
});
