/**
 * OSC005 Hold Focus — Wizard Arms d0.
 * Printed: Action - Destroy this: Amp 1. Go again
 * CR 8.5.47: Amp = next arcane damage this turn +N.
 * Card model fix: type:"amp" → replacement (same as OMN097).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { holdFocus } from "../../../../../../cards/src/cards/equipment/hold-focus.ts";
import { zapRed } from "../../../../../../cards/src/cards/actions/zap.ts";

const LIFE = 40;

describe("hold-focus (OSC005)", () => {
  it("core: Action destroy → Amp 1 + go again; next Zap 3+1=4 arcane", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arms: [holdFocus], hand: [zapRed], actionPoints: 2, deck: 6 },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);

    // Activate hold-focus: Action destroy-self → Amp 1 + go again.
    Bravo.activate(holdFocus);
    // Arms destroyed → GY.
    expect(Bravo.zone("arms")).not.toContain(holdFocus.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(holdFocus.canonicalId);
    // Go again: 1 AP spent on Action, but go again refunds it.
    // (Action costs 1 AP; layerKeywords goAgain refunds on resolution.)

    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    // Play Zap (0-cost arcane 3 to target hero) — Amp 1 adds +1 = 4 arcane.
    Bravo.play(zapRed, { target: Opponent.id });
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    // 3 + Amp 1 = 4 arcane damage.
    expect(Opponent.life()).toBe(LIFE - 4);
  });

  it("boundary: go again refunds AP after Action destroy", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arms: [holdFocus], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(holdFocus);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    // Go again refunded the 1 AP spent on the Action.
    expect(Bravo.actionPoints()).toBe(1);
    expect(Bravo.zone("arms")).not.toContain(holdFocus.canonicalId);
  });
});
