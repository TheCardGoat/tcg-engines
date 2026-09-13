/** PEN120 Sigil of Fate — Wizard token aura: self-destructs at action phase. */
import { describe, expect, it } from "vitest";
import { sigilOfFate } from "../../../../cards/src/cards/tokens/sigil-of-fate.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash } from "../../rules/fixtures.ts";

describe("Sigil of Fate token (PEN120)", () => {
  it("AAA: self-destructs at controller's action phase start", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [sigilOfFate], deck: 8, actionPoints: 1, resourcePoints: 0 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    expect(Bravo.zone("arena")).toContain(sigilOfFate.canonicalId);

    // Advance through a full turn cycle to reach Bravo's next action phase.
    Bravo.endTurn();
    Dash.endTurn();
    game.passBoth();

    expect(Bravo.zone("arena")).not.toContain(sigilOfFate.canonicalId);
  });

  it("opts 1 when it leaves the arena (CR 8.6.37)", () => {
    // The card-level `opt` keyword is expanded to an effect only on the equipment
    // play path; Sigil of Fate is an aura, so its opt must come from the explicit
    // leave-arena effect on PEN120-a1, with no printed keyword.
    const a1 = sigilOfFate.base.abilities?.find(
      (a) => a.id === "qBqzbKjQwMKKnBtM7GJGH:optWhenLeavingArena",
    ) as unknown as
      | {
          resolution?: { effect?: { type?: string } };
        }
      | undefined;
    expect(a1?.resolution?.effect?.type).toBe("opt");
    expect(sigilOfFate.base.keywords ?? []).toEqual([]);
  });
});
