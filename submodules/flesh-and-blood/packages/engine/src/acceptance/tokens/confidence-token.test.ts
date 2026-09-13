/** APS031 Confidence — self-destructs at turn start; CR 8.6.35's non-block defender cap. */
import { describe, expect, it } from "vitest";

import { FabTestEngine } from "../../testing/test-engine.ts";
import {
  bravo,
  dash,
  nimbleStrikeRed,
  nimblismBlue,
  scourTheBattlescapeRed,
  snatchRed,
} from "../../rules/fixtures.ts";
import { confidence } from "../../../../cards/src/cards/tokens/confidence.ts";

describe("Confidence token (APS031)", () => {
  it("self-destructs at the controller's turn start (CR 8.6.35)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [confidence], hand: [snatchRed], deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    expect(Bravo.zone("arena")).toContain(confidence.canonicalId);

    Bravo.endTurn();
    game.as(dash).endTurn();
    game.passBoth();

    expect(Bravo.zone("arena")).not.toContain(confidence.canonicalId);
  });

  it("caps non-block (non-Block-type) defenders at 2 (CR 8.6.35 + CR 8.1.12)", () => {
    // CR 8.1.12 "Block" is a card type; a "non-block card" is one NOT of type
    // Block — NOT "a card with no {d}". Action cards (nimblismBlue,
    // nimbleStrikeRed, snatchRed) have a block value yet are non-block, so
    // Confidence's "no more than 2 non-block cards" cap counts them.
    const game = FabTestEngine.start(
      { hero: bravo, arena: [confidence], hand: [snatchRed], deck: 6 },
      { hero: dash, hand: [nimblismBlue, nimbleStrikeRed, snatchRed], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();
    game.as(dash).endTurn();
    game.passBoth();
    expect(Bravo.zone("arena")).not.toContain(confidence.canonicalId);

    Bravo.play(snatchRed);
    game.passBoth();
    game.passBoth();
    expect(game.combat()?.step).toBe("defend");

    // Three non-block (Action) defenders exceed the two-non-block cap.
    expect(
      game.as(dash).expectBlockRejected([nimblismBlue, nimbleStrikeRed, snatchRed]).errorCode,
    ).toBe("restricted_by_rule");
  });

  it("allows up to 2 non-block defenders (CR 8.6.35)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [confidence], hand: [snatchRed], deck: 6 },
      { hero: dash, hand: [nimblismBlue, nimbleStrikeRed], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    Bravo.endTurn();
    game.as(dash).endTurn();
    game.passBoth();
    Bravo.play(snatchRed);
    game.passBoth();
    game.passBoth();
    expect(game.combat()?.step).toBe("defend");

    // Two non-block defenders is exactly the cap → allowed.
    expect(() => game.as(dash).defendWith([nimblismBlue, nimbleStrikeRed])).not.toThrow();
  });

  it("scopes the cap to the next attack only — a later attack is uncapped (CR 8.6.35)", () => {
    // Confidence caps "the next attack action card you play this turn" — only
    // the first attack latches (appliesTo.next: remaining 1→0 on latch). A
    // second attack the same turn must NOT inherit the cap. Regression for a
    // missing rule.subjects membership check in the maxDefenders counting loop
    // (legality-quotes.ts): without it, the turn-long cap leaks onto every
    // later attack. A go-again first attack refunds an action point on hit,
    // enabling a second attack action card to probe the leak.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [confidence],
        arsenal: [scourTheBattlescapeRed],
        hand: [snatchRed],
        deck: 8,
      },
      { hero: dash, hand: [nimblismBlue, nimbleStrikeRed, snatchRed], deck: 8 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    // Trigger Confidence at Bravo's next turn start (destroy self + emit rule).
    Bravo.endTurn();
    game.as(dash).endTurn();
    game.passBoth();
    expect(Bravo.zone("arena")).not.toContain(confidence.canonicalId);

    // --- Attack 1: the latched "next attack action card" — cap applies. ---
    Bravo.attackWith(scourTheBattlescapeRed, { from: "arsenal" });
    expect(
      game.as(dash).expectBlockRejected([nimblismBlue, nimbleStrikeRed, snatchRed]).errorCode,
    ).toBe("restricted_by_rule");
    // Resolve undefended → hits → go again refunds an action point.
    game.helpers.resolveRestOfCombat();
    expect(Bravo.actionPoints()).toBe(1);

    // --- Attack 2: same turn, NOT the latched attack — cap must NOT apply. ---
    Bravo.attackWith(snatchRed);
    expect(() =>
      game.as(dash).defendWith([nimblismBlue, nimbleStrikeRed, snatchRed]),
    ).not.toThrow();
  });
});
