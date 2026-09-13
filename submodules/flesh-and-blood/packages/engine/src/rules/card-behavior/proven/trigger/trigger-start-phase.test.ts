/**
 * AAA test for trigger: start-phase.
 * Representative card: Aqua Seeing Shell (MST067) — Mystic Equipment (Head).
 * Static triggered ability: "At the start of your turn, destroy this."
 * Tests that the start-phase trigger fires at the beginning of the
 * controller's turn, destroying the source card.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { aquaSeeingShell, bravo, dash } from "../../../fixtures.ts";

describe("trigger: start-phase", () => {
  it("AAA: Aqua Seeing Shell is destroyed at the start of its controller's turn", () => {
    // Arrange — Aqua Seeing Shell starts in Bravo's arena.
    const game = FabTestEngine.start(
      { hero: bravo, arena: [aquaSeeingShell], deck: 4, intellect: 0 },
      { hero: dash, deck: 4, intellect: 0 },
    );
    const Bravo = game.as(bravo);
    expect(Bravo.zone("arena")).toContain(aquaSeeingShell.canonicalId);

    // Act — End Bravo's turn, then Dash's turn. When Bravo's next turn
    // starts, the start-phase trigger fires and destroys Aqua Seeing Shell.
    Bravo.endTurn();
    game.as(dash).endTurn();

    // Assert — destroyed and moved to graveyard.
    expect(Bravo.zone("arena")).not.toContain(aquaSeeingShell.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(aquaSeeingShell.canonicalId);
  });

  it("AAA boundary: Aqua Seeing Shell survives the opponent's turn start (only fires on controller's turn)", () => {
    // Arrange — Aqua Seeing Shell starts in Bravo's arena.
    const game = FabTestEngine.start(
      { hero: bravo, arena: [aquaSeeingShell], deck: 4, intellect: 0 },
      { hero: dash, deck: 4, intellect: 0 },
    );
    const Bravo = game.as(bravo);
    expect(Bravo.zone("arena")).toContain(aquaSeeingShell.canonicalId);

    // Act — End Bravo's turn. Dash's turn starts, but the trigger should
    // NOT fire because it says "At the start of YOUR turn" (Bravo's turn).
    Bravo.endTurn();

    // Assert — Aqua Seeing Shell is still in the arena; it was not destroyed
    // by the opponent's turn start.
    expect(Bravo.zone("arena")).toContain(aquaSeeingShell.canonicalId);
    expect(Bravo.zone("graveyard")).not.toContain(aquaSeeingShell.canonicalId);
  });
});
