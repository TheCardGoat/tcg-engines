/**
 * SMP016 Bloodied Gauntlet — Event Arms d0.
 * Printed: Action - Destroy this: The next attack action card you play this
 * turn gets +2{p}. Go again
 * Mirrors proven SMP015 bloodied-strapping (same destroy → appliesTo.next AAC).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { bloodiedGauntlet } from "../../../../../../cards/src/cards/equipment/bloodied-gauntlet.ts";

const LIFE = 40;
const SNATCH = 4;

describe("bloodied-gauntlet (SMP016)", () => {
  it("core: Action destroy → next AAC +2{p} + go again", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arms: [bloodiedGauntlet], hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);

    // Activate gauntlet: destroy → next AAC +2{p} + go again.
    Bravo.activate(bloodiedGauntlet);
    for (let s = 0; s < 16; s += 1) {
      const d = game.getState().decision;
      if (d && game.answerForcedDecision()) continue;
      if (d) break;
      if (game.getState().rulesStack.length > 0) {
        game.passBoth();
        continue;
      }
      break;
    }
    // Arms destroyed → GY.
    expect(Bravo.zone("arms")).not.toContain(bloodiedGauntlet.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(bloodiedGauntlet.canonicalId);
    // Go again refunded the AP.
    expect(Bravo.actionPoints()).toBe(1);

    // Play Snatch (AAC) — +2{p} from the buff: 4 + 2 = 6 damage.
    Bravo.play(snatchRed, { target: Opponent.id });
    game.helpers.resolveRestOfCombat();

    expect(Opponent.life()).toBe(LIFE - (SNATCH + 2));
  });

  it("boundary: 0 AP → activate illegal (Action costs AP)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arms: [bloodiedGauntlet], actionPoints: 0, deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => game.as(bravo).activate(bloodiedGauntlet)).toThrow();
    expect(game.as(bravo).zone("arms")).toContain(bloodiedGauntlet.canonicalId);
  });
});
