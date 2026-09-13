import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kano } from "../heroes/kano.ts";
import { tomeOfAetherwindRed } from "./tome-of-aetherwind.ts";
import { zapRed } from "./zap.ts";

/**
 * Tome of Aetherwind Red (ARC122) — Wizard Action.
 *
 * Printed: Choose 2. You may choose the same mode more than once;
 * - The next card you play this turn with an effect that deals arcane
 *   damage, instead deals that much arcane damage plus 1.
 * - Draw a card.
 */

function chooseMode(game: FabTestEngine, actor: ReturnType<FabTestEngine["as"]>, id: string): void {
  for (let step = 0; step < 24; step += 1) {
    const wait = game.waitState();
    if (wait.kind === "decision") {
      actor.choose(id);
      return;
    }
    if (wait.kind === "priority") {
      game.pass(wait.playerId);
      continue;
    }
    break;
  }
}

describe("Tome of Aetherwind (ARC122) AAA", () => {
  it("happy: distinct modes — draw a card and amp the next arcane card", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [tomeOfAetherwindRed, zapRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    const tomeId = Kano.findCardInZone("hand", tomeOfAetherwindRed);
    game.playInstance(Kano.id, tomeId, {}, "explicit");
    chooseMode(
      game,
      Kano,
      `${tomeOfAetherwindRed.canonicalId}:chooseModes:increaseNextArcaneDamage`,
    );
    chooseMode(game, Kano, `${tomeOfAetherwindRed.canonicalId}:chooseModes:drawCard`);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expectFabPlayer(Kano).toHaveHandCount(2); // drew 1 to replace the tome

    Kano.play(zapRed, { target: Dash.id });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(16); // 20 - (3 + 1)
  });

  it("pin: repeating a mode answers both picks but only one instance executes (§5 engine/modal-allow-repeat-dead)", () => {
    const game = FabTestEngine.start(
      { hero: kano, hand: [tomeOfAetherwindRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);

    const tomeId = Kano.findCardInZone("hand", tomeOfAetherwindRed);
    game.playInstance(Kano.id, tomeId, {}, "explicit");
    chooseMode(game, Kano, `${tomeOfAetherwindRed.canonicalId}:chooseModes:drawCard`);
    chooseMode(game, Kano, `${tomeOfAetherwindRed.canonicalId}:chooseModes:drawCard`);
    game.helpers.resolveUntilIdle();

    // Printed "you may choose the same mode more than once" should draw 2;
    // the second instance of a repeated mode id never executes.
    expectFabPlayer(Kano).toHaveHandCount(1);
  });
});
