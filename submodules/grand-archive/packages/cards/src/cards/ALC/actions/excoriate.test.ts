import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fiveOfDiamonds } from "../../RDO/allies/five-of-diamonds.ts";
import { potionOfHealing } from "../items/potion-of-healing.ts";
import { excoriate } from "./excoriate.ts";

function fireChampion(level: number) {
  const champion = lineageTestChampion("Excoriate", level);
  if (champion.layout.kind !== "single-faced") throw new Error("Expected fixture champion");
  return {
    ...champion,
    layout: {
      kind: "single-faced" as const,
      face: { ...champion.layout.face, elements: ["NORM", "FIRE"] as const },
    },
  };
}

function fixture(level: 1 | 2) {
  const starter = fireChampion(0);
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion: starter,
      lineage: Array.from({ length: level }, (_, index) => fireChampion(index + 1)),
      zones: {
        hand: [excoriate, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
      },
    },
    playerTwo: {
      champion: lineageTestChampion("Excoriate opponent", 0),
      zones: { field: [woodlandSquirrels, fiveOfDiamonds, potionOfHealing] },
    },
  });
  return game;
}

/** @covers ls6g7xgwve-a1 */
/** @covers ls6g7xgwve-a2 */
describe("Excoriate — level discount and bounded Ally destruction", () => {
  for (const level of [1, 2] as const) {
    it(`pays ${level >= 2 ? 3 : 4} reserve at level ${level} and destroys the legal target`, () => {
      const game = fixture(level);
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const target = opponent.card(woodlandSquirrels, { zone: "field" });
      const payment = player.cards(woodlandSquirrels, { zone: "hand" });
      const cost = level >= 2 ? 3 : 4;
      const before = game.state;
      expect(() =>
        player.activate(excoriate, {
          reservePayment: payment.slice(0, cost - 1).map((card) => ({
            kind: "card" as const,
            cardId: card.objectId,
          })),
          targets: { "target-1": [target.objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);

      player.activate(excoriate, {
        reservePayment: payment.slice(0, cost).map((card) => ({
          kind: "card",
          cardId: card.objectId,
        })),
        targets: { "target-1": [target.objectId] },
      });
      expect(opponent.cards(target, { zone: "field" })).toHaveLength(1);
      passEffectsStack(game);
      expect(opponent.cards(target, { zone: "graveyard" })).toHaveLength(1);
      expect(player.zone("memory")).toHaveLength(cost);
    });
  }

  it("rejects a reserve-five Ally and a non-Ally before paying costs", () => {
    const game = fixture(2);
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const payment = player.cards(woodlandSquirrels, { zone: "hand" }).slice(0, 3);
    for (const invalid of [
      opponent.card(fiveOfDiamonds, { zone: "field" }),
      opponent.card(potionOfHealing, { zone: "field" }),
    ]) {
      const before = game.state;
      expect(() =>
        player.activate(excoriate, {
          reservePayment: payment.map((card) => ({ kind: "card", cardId: card.objectId })),
          targets: { "target-1": [invalid.objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
    }
  });
});
