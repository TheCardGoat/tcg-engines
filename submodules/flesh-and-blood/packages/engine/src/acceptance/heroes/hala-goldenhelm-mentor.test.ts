/** DVR007 Hala Goldenhelm — start-phase face-up trigger. */
import { describe, expect, it } from "vitest";

import { halaGoldenhelm } from "../../../../cards/src/cards/mentors/hala-goldenhelm.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash } from "../../rules/fixtures.ts";

describe("Hala Goldenhelm mentor (DVR007)", () => {
  it("a1 AAA: start-phase turns her face-up from face-down Arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arsenal: [{ card: halaGoldenhelm, state: { faceDown: true } }],
        deck: 4,
      },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const instanceId = Bravo.findCardInZone("arsenal", halaGoldenhelm);

    Bravo.endTurn();
    Dash.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expect(game.objectState(instanceId).faceDown).toBe(false);
  });
});
