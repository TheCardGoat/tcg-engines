import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { violetHaze } from "./violet-haze.ts";

/** @covers vdxi74wa4x-a1 @covers vdxi74wa4x-a2 */
describe("Violet Haze — distance and inherited life penalty", () => {
  it("makes only controlled units distant and gives the targeted champion minus two life", () => {
    const champion = createClassBonusTestChampion(violetHaze, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [violetHaze, woodlandSquirrels, woodlandSquirrels],
          field: [giantTortoise],
        },
      },
      playerTwo: { champion, zones: { field: [giantTortoise] } },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const ownChampion = player.card(champion, { zone: "field" });
    const ownAlly = player.card(giantTortoise, { zone: "field" });
    const opposingChampion = opponent.card(champion, { zone: "field" });
    const opposingAlly = opponent.card(giantTortoise, { zone: "field" });
    const source = player.card(violetHaze, { zone: "hand" });
    player.activate(source, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card", cardId: card.objectId })),
      targets: { "target-champion": [opposingChampion.objectId] },
    });
    passEffectsStack(game);

    expect(game.state.objects[ownChampion.objectId]!.states.has("distant")).toBe(true);
    expect(game.state.objects[ownAlly.objectId]!.states.has("distant")).toBe(true);
    expect(game.state.objects[opposingAlly.objectId]!.states.has("distant")).toBe(false);
    expect(game.state.objects[source.objectId]!).toMatchObject({
      zone: "inner-lineage",
      hostId: opposingChampion.objectId,
    });
    expect(
      deriveGrandArchiveNumericProperty(game.state.objects[opposingChampion.objectId]!, "life", {
        program: game.program,
        state: game.state,
        controllerId: opponent.id,
        bindings: {},
      }),
    ).toBe(13);
    expect(
      deriveGrandArchiveNumericProperty(game.state.objects[ownChampion.objectId]!, "life", {
        program: game.program,
        state: game.state,
        controllerId: player.id,
        bindings: {},
      }),
    ).toBe(15);
  });
});
