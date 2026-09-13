/** PSM002 The Librarian — start-phase face-up trigger. */
import { describe, expect, it } from "vitest";
import { theLibrarian } from "../../../../cards/src/cards/mentors/the-librarian.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash } from "../../rules/fixtures.ts";

describe("The Librarian mentor (PSM002)", () => {
  it("a1 AAA: start-phase turns him face-up from face-down Arsenal", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arsenal: [{ card: theLibrarian, state: { faceDown: true } }], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Bravo.endTurn();
    Dash.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    expect(game.objectState(Bravo.findCardInZone("arsenal", theLibrarian)).faceDown).toBe(false);
  });
});
