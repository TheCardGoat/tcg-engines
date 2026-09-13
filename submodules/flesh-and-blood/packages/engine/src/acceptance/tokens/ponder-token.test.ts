/** DYN244 Ponder — controller end-phase destroys it and draws one card. */
import { describe, expect, it } from "vitest";

import { ponder } from "../../../../cards/src/cards/tokens/ponder.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash } from "../../rules/fixtures.ts";

describe("Ponder token (DYN244)", () => {
  it("AAA: destroys and draws at its controller's end phase, not the opponent's", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [ponder], deck: 8 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const handBefore = Bravo.handCount();

    expect(Bravo.zone("arena")).toContain(ponder.canonicalId);
    Bravo.endTurn();
    expect(game.getState().rulesStack).toHaveLength(1);
    game.passBoth();

    expect(Bravo.zone("arena")).not.toContain(ponder.canonicalId);
    expect(Bravo.handCount()).toBe(handBefore + 1);
    expect(Dash.zone("arena")).not.toContain(ponder.canonicalId);
  });

  it("end-phase trigger is controller-scoped (CR 8.6.17 'your end phase')", () => {
    const ability = ponder.base.abilities?.[0] as unknown as
      | {
          trigger?: { event?: { actor?: string } };
        }
      | undefined;
    expect(ability?.trigger?.event?.actor).toEqual({
      kind: "player",
      player: "ability-controller",
    });
  });
});
