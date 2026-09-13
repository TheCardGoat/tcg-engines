import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { galesMare } from "../../RDO/allies/gales-mare.ts";
import { zhangFeiSpiritedSteel } from "../allies/zhang-fei-spirited-steel.ts";
import { pairedMindsKindredSouls } from "./paired-minds-kindred-souls.ts";

/** @covers 7qjnqww067-a1 */
describe("Paired Minds, Kindred Souls — find a Horse ally", () => {
  it("puts a Horse ally from the top ten into hand and rejects non-Horses", () => {
    const champion = createClassBonusTestChampion(
      pairedMindsKindredSouls,
      false,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [pairedMindsKindredSouls, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          "main-deck": [galesMare, ...Array.from({ length: 9 }, () => woodlandSquirrels)],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const deck = player.zone("main-deck");
    const horse = player.card(galesMare, { zone: "main-deck" });
    player.activate(pairedMindsKindredSouls, {
      reservePayment: player.cards(woodlandSquirrels, { zone: "hand" }).map((card) => ({
        kind: "card" as const,
        cardId: card.objectId,
      })),
    });
    passEffectsStack(game);
    const beforeInvalid = game.state;
    expect(() => answerDecision(game, "resolve-effect-choice", [deck[1]!.objectId])).toThrow();
    expect(game.state).toEqual(beforeInvalid);
    answerDecision(game, "resolve-effect-choice", [horse.objectId]);
    passEffectsStack(game);
    if (game.state.decision?.kind === "resolve-effect-choice") {
      const remainder = player
        .zone("main-deck")
        .filter((card) => card.objectId !== horse.objectId)
        .slice(0, 9);
      answerDecision(
        game,
        "resolve-effect-choice",
        remainder.map((card) => card.objectId),
      );
      passEffectsStack(game);
    }
    expect(game.state.objects[horse.objectId]!.zone).toBe("hand");
    expect(player.zone("main-deck")).toHaveLength(9);
  });
});

/** @covers 7qjnqww067-a2 */
describe("Paired Minds, Kindred Souls — next Horse discount", () => {
  it("discounts the next Horse ally only with Class Bonus and a unique ally", () => {
    for (const [classBonus, unique, discount] of [
      [true, true, true],
      [true, false, false],
      [false, true, false],
    ] as const) {
      const baseChampion = createClassBonusTestChampion(
        pairedMindsKindredSouls,
        classBonus,
        "activation-discount",
      );
      if (baseChampion.layout.kind !== "single-faced") throw new Error("expected single face");
      const champion = {
        ...baseChampion,
        layout: {
          kind: "single-faced" as const,
          face: { ...baseChampion.layout.face, elements: ["NORM", "WIND"] as const },
        },
      };
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [
              pairedMindsKindredSouls,
              galesMare,
              ...Array.from({ length: 6 }, () => woodlandSquirrels),
            ],
            field: unique ? [zhangFeiSpiritedSteel] : [woodlandSquirrels],
            "main-deck": [galesMare, ...Array.from({ length: 9 }, () => woodlandSquirrels)],
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      player.activate(pairedMindsKindredSouls, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 3)
          .map((card) => ({
            kind: "card" as const,
            cardId: card.objectId,
          })),
      });
      passEffectsStack(game);
      if (game.state.decision?.kind === "resolve-effect-choice") {
        const looked = player.zone("main-deck").slice(0, 10);
        const horseFromDeck = looked.find(
          (card) => game.state.objects[card.objectId]?.definitionId === galesMare.canonicalId,
        );
        if (horseFromDeck) {
          answerDecision(game, "resolve-effect-choice", [horseFromDeck.objectId]);
          passEffectsStack(game);
          if (game.state.decision?.kind === "resolve-effect-choice") {
            answerDecision(
              game,
              "resolve-effect-choice",
              looked
                .filter((card) => card.objectId !== horseFromDeck.objectId)
                .map((card) => card.objectId),
            );
            passEffectsStack(game);
          }
        }
      }
      const horseCost = discount ? 1 : 3;
      const payment = player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, horseCost)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
      const before = game.state;
      const horseInHand = player.cards(galesMare, { zone: "hand" })[0]!;
      expect(() =>
        player.activate(horseInHand, {
          reservePayment: payment.slice(0, Math.max(0, horseCost - 1)),
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      player.activate(horseInHand, { reservePayment: payment });
      expect(player.cards(woodlandSquirrels, { zone: "memory" }).length).toBeGreaterThanOrEqual(
        horseCost,
      );
    }
  });
});
