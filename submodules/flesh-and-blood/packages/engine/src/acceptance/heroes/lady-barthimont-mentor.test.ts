/** LEV002 Lady Barthimont — start-phase face-up trigger. */
import { describe, expect, it } from "vitest";
import { ladyBarthimont } from "../../../../cards/src/cards/mentors/lady-barthimont.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash } from "../../rules/fixtures.ts";

describe("Lady Barthimont mentor (LEV002)", () => {
  it("a1 AAA: start-phase turns her face-up from face-down Arsenal", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arsenal: [{ card: ladyBarthimont, state: { faceDown: true } }], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Bravo.endTurn();
    Dash.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    expect(game.objectState(Bravo.findCardInZone("arsenal", ladyBarthimont)).faceDown).toBe(false);
  });
});
