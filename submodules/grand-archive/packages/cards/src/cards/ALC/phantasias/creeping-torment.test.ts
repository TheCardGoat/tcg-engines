import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { neosSight } from "../actions/neos-sight.ts";
import { creepingTorment } from "./creeping-torment.ts";

/** @covers zrplywc08c-a1 @covers zrplywc08c-a2 */
describe("Creeping Torment — attached second-draw punishment", () => {
  it("enters the targeted champion's lineage and damages it on its controller's second draw", () => {
    const champion = createClassBonusTestChampion(creepingTorment, false, "activation-discount");
    const opposingChampion = createClassBonusTestChampion(neosSight, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: { hand: [creepingTorment, woodlandSquirrels] },
      },
      playerTwo: {
        champion: opposingChampion,
        zones: {
          hand: [neosSight, neosSight],
          "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const target = opponent.card(opposingChampion, { zone: "field" });
    const source = player.card(creepingTorment, { zone: "hand" });
    player.activate(source, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card", cardId: card.objectId })),
    });
    passEffectsStack(game);
    answerDecision(game, "announce-triggered-ability", {
      targets: { "target-champion": [target.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[source.objectId]!).toMatchObject({
      zone: "inner-lineage",
      hostId: target.objectId,
    });

    const drawActions = opponent.cards(neosSight, { zone: "hand" });
    player.pass();
    opponent.activate(drawActions[0]!);
    passEffectsStack(game);
    expect(game.state.objects[target.objectId]!.damage).toBe(0);
    player.pass();
    opponent.activate(drawActions[1]!);
    passEffectsStack(game);
    expect(game.state.objects[target.objectId]!.damage).toBe(2);
  });
});
