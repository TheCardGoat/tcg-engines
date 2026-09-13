/** RVD007 Chief Ruk'utan — start-phase face-up trigger. */
import { describe, expect, it } from "vitest";
import { chiefRukUtan } from "../../../../cards/src/cards/mentors/chief-ruk-utan.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash } from "../../rules/fixtures.ts";

describe("Chief Ruk'utan mentor (RVD007)", () => {
  it("a1 AAA: start-phase turns him face-up from face-down Arsenal", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arsenal: [{ card: chiefRukUtan, state: { faceDown: true } }], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Bravo.endTurn();
    Dash.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    expect(game.objectState(Bravo.findCardInZone("arsenal", chiefRukUtan)).faceDown).toBe(false);
  });
});
