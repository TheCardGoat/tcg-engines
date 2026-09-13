import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { viserai } from "../heroes/viserai.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { soulShackle } from "./soul-shackle.ts";

/**
 * Soul Shackle (CHN030) — Shadow Runeblade Token - Aura.
 * Printed: "At the beginning of your action phase, banish the top card of
 * your deck."
 */
describe("Soul Shackle (CHN030) AAA", () => {
  it("happy: the Shackle banishes the top card of its controller's deck at the action phase", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        arena: [soulShackle],
        hand: 4,
        deck: 6,
        deckTop: [snatchRed],
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Viserai = game.as(viserai);
    const top = Viserai.cardsIn("deck", snatchRed)[0]!;

    Viserai.endTurn();
    game.helpers.untilIdle({ optionals: "decline" });
    game.as(dash).endTurn();
    game.helpers.untilIdle({ optionals: "decline" });

    expectFabCard(Viserai, top).toBeIn("banished");
  });

  it("timing: the Shackle keeps banishing the new top card at every action phase", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        arena: [soulShackle],
        hand: 4,
        deck: 6,
        deckTop: [snatchRed],
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Viserai = game.as(viserai);

    Viserai.endTurn();
    game.helpers.untilIdle({ optionals: "decline" });
    game.as(dash).endTurn();
    game.helpers.untilIdle({ optionals: "decline" });
    expect(Viserai.cardsIn("banished", snatchRed)).toHaveLength(1);

    // The next action phase banishes whatever is on top then.
    Viserai.endTurn();
    game.helpers.untilIdle({ optionals: "decline" });
    game.as(dash).endTurn();
    game.helpers.untilIdle({ optionals: "decline" });
    expect(Viserai.zone("banished").length).toBeGreaterThanOrEqual(2);
  });
});
