/** HVY134 Cintari Sellsword — 3/2 Warrior Mercenary Ally with attack (costs {r}) and go again. */
import { describe, expect, it } from "vitest";
import { cintariSellsword } from "../../../../cards/src/cards/tokens/cintari-sellsword.ts";
import { edgeOfAutumn } from "../../../../cards/src/cards/weapons/edge-of-autumn.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash } from "../../rules/fixtures.ts";

describe("Cintari Sellsword token (HVY134)", () => {
  it("AAA: activate attack ability (costs 1r) commits an attack event with Cintari as source", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [cintariSellsword],
        weapon1: [edgeOfAutumn],
        deck: 8,
        actionPoints: 1,
        resourcePoints: 2,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activateAttack(edgeOfAutumn);
    game.advanceUntil({ stopAt: "defend" });
    game.as(dash).defendWith();
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    Bravo.activate(cintariSellsword);
    game.passBoth();

    const sellswordAttack = game
      .committedEvents()
      .find(
        (event) =>
          event.name === "attack" && event.source?.canonicalId === cintariSellsword.canonicalId,
      );
    expect(sellswordAttack).toBeDefined();
  });
});
