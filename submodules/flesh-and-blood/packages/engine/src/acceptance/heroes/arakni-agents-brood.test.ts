/**
 * HNT Agents — shared return-to-brood acceptance.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { arakniMarionette } from "../../../../cards/src/cards/heroes/arakni-marionette.ts";
import { arakniBlackWidow } from "../../../../cards/src/cards/demi-heroes/arakni-black-widow.ts";
import { bravo } from "../../rules/fixtures.ts";

describe("Arakni Agents — return to the brood", () => {
  it("a3: continues existing in arena after end phase", () => {
    const game = FabTestEngine.start(
      { hero: bravo, deck: 4 },
      { hero: arakniMarionette, arena: [arakniBlackWidow], deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Weaver = game.as(arakniMarionette);

    Bravo.endTurn();
    game.passBoth();
    Weaver.endTurn();

    // The return-to-brood sets a status marker; the Agent remains in arena
    expect(Weaver.zone("arena")).toContain(arakniBlackWidow.canonicalId);
  });

  it("a3 boundary: Agent in inventory does not trigger", () => {
    const game = FabTestEngine.start(
      { hero: bravo, deck: 4 },
      { hero: arakniMarionette, inventory: [arakniBlackWidow], deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Weaver = game.as(arakniMarionette);

    Bravo.endTurn();
    game.passBoth();
    Weaver.endTurn();

    expect(Weaver.zone("inventory")).toContain(arakniBlackWidow.canonicalId);
  });
});
