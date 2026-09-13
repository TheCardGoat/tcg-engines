import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { glacialGuidance } from "../../DOA/actions/glacial-guidance.ts";
import { fiveOfDiamonds } from "../../RDO/allies/five-of-diamonds.ts";
import { torrentialBlast } from "./torrential-blast.ts";

function fixture(classBonus: boolean, waterInGraveyard: number) {
  const champion = createClassBonusTestChampion(torrentialBlast, classBonus, "activation-discount");
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: {
        hand: [torrentialBlast, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        graveyard: Array.from({ length: waterInGraveyard }, () => glacialGuidance),
        "main-deck": [glacialGuidance, woodlandSquirrels, woodlandSquirrels],
      },
    },
    playerTwo: { champion, zones: { field: [fiveOfDiamonds] } },
  });
  return game;
}

/** @covers vwbcizm6h3-a1 */
/** @covers vwbcizm6h3-a2 */
describe("Torrential Blast — restricted mill and graveyard-scaled damage", () => {
  for (const classBonus of [false, true]) {
    for (const waterInGraveyard of [0, 2]) {
      it(`Class Bonus=${classBonus}, initial water cards=${waterInGraveyard}`, () => {
        const game = fixture(classBonus, waterInGraveyard);
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const target = opponent.card(fiveOfDiamonds, { zone: "field" });
        const deck = player.zone("main-deck");
        player.activate(torrentialBlast, {
          reservePayment: player
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((card) => ({ kind: "card", cardId: card.objectId })),
          targets: { "target-1": [target.objectId] },
        });
        passEffectsStack(game);

        expect(player.zone("main-deck")).toEqual(classBonus ? deck.slice(2) : deck);
        expect(game.state.objects[target.objectId]!.damage).toBe(
          waterInGraveyard + (classBonus ? 1 : 0),
        );
      });
    }
  }

  it("allows zero targets while still applying the Class Bonus mill", () => {
    const game = fixture(true, 0);
    const player = game.player("player-one");
    const target = game.player("player-two").card(fiveOfDiamonds, { zone: "field" });
    const deck = player.zone("main-deck");
    player.activate(torrentialBlast, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card", cardId: card.objectId })),
      targets: { "target-1": [] },
    });
    passEffectsStack(game);
    expect(player.zone("main-deck")).toEqual(deck.slice(2));
    expect(game.state.objects[target.objectId]!.damage).toBe(0);
  });
});
