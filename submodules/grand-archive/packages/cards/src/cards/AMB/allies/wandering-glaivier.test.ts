import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceCombatToTrigger, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { wanderingGlaivier } from "./wandering-glaivier.ts";

/** @covers p6120p3f5d-a1 */
describe("Wandering Glaivier — On Death draw", () => {
  it("draws one card for each player only after the death trigger resolves", () => {
    const champion = createClassBonusTestChampion(wanderingGlaivier, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: {
          field: [wanderingGlaivier],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [automatedGardener],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const ownDeck = player.zone("main-deck");
    const enemyDeck = opponent.zone("main-deck");
    const glaivier = player.card(wanderingGlaivier, { zone: "field" });
    opponent.declareAttack(opponent.card(automatedGardener, { zone: "field" }), glaivier);
    advanceCombatToTrigger(game, "p6120p3f5d-a1");
    expect(player.zone("graveyard")).toEqual([glaivier]);
    expect(player.zone("hand")).toHaveLength(0);
    expect(opponent.zone("hand")).toHaveLength(0);
    expect(
      game.state.stack.some(
        (item) => item.kind === "triggered-ability" && item.ability.id === "p6120p3f5d-a1",
      ),
    ).toBe(true);
    passEffectsStack(game);
    expect(player.zone("hand")).toEqual(ownDeck.slice(0, 1));
    expect(opponent.zone("hand")).toEqual(enemyDeck.slice(0, 1));
    expect(player.zone("main-deck")).toEqual(ownDeck.slice(1));
    expect(opponent.zone("main-deck")).toEqual(enemyDeck.slice(1));
  });
});
