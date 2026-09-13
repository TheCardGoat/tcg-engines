import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { springleaf } from "../tokens/springleaf.ts";
import { brewingKit } from "./brewing-kit.ts";
import { potionOfHealing } from "./potion-of-healing.ts";

/** @covers dwmxz1vdxi-a1 */
describe("Brewing Kit — Herb-funded Potion search", () => {
  it("sacrifices exactly three Herbs, reveals a Potion, and bottoms the ordered remainder", () => {
    const champion = lineageTestChampion("Brewing", 0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [brewingKit, springleaf, springleaf, springleaf],
          "main-deck": [
            woodlandSquirrels,
            potionOfHealing,
            woodlandSquirrels,
            woodlandSquirrels,
            woodlandSquirrels,
            woodlandSquirrels,
          ],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const source = player.card(brewingKit, { zone: "field" });
    const herbs = player.cards(springleaf, { zone: "field" });
    const deck = player.zone("main-deck");
    const potion = player.card(potionOfHealing, { zone: "main-deck" });
    player.activateAbility(source, "dwmxz1vdxi-a1", {
      costSelections: [herbs.map((card) => card.objectId)],
    });
    expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
    expect(player.cards(springleaf, { zone: "field" })).toHaveLength(0);
    passEffectsStack(game);

    answerDecision(game, "resolve-effect-choice", [potion.objectId]);
    passEffectsStack(game);
    expect(player.cards(potionOfHealing, { zone: "hand" })).toEqual([potion]);

    const remainder = deck.slice(0, 6).filter((card) => card.objectId !== potion.objectId);
    const ordered = [...remainder].reverse();
    answerDecision(
      game,
      "resolve-effect-choice",
      ordered.map((card) => card.objectId),
    );
    passEffectsStack(game);
    expect(player.zone("main-deck")).toEqual(ordered);
  });
});
