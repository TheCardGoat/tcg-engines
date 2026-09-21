import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { provePrideAlly } from "../../../testing/pride-ally.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { kraalStonescaleTyrant } from "../../FTC/allies/kraal-stonescale-tyrant.ts";
import { babyBlueSlime } from "../../P24/allies/baby-blue-slime.ts";
import { babyGreenSlime } from "../../P24/allies/baby-green-slime.ts";
import { babyRedSlime } from "../../P24/allies/baby-red-slime.ts";
import { simpleSlime } from "../../RDO/allies/simple-slime.ts";
import { slimeKing } from "./slime-king.ts";

/** @covers f0ymeslfpw-a1 */
describe("Slime King — three distinct-element Slime activation cost", () => {
  it("rejects three Slimes that do not have different elements", () => {
    const champion = grantTestChampionLevel(
      createClassBonusTestChampion(slimeKing, true, "activation-discount"),
      4,
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [slimeKing, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          graveyard: [simpleSlime, simpleSlime, simpleSlime],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const before = game.state;
    expect(() =>
      player.activate(slimeKing, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
        costSelections: [
          player.cards(simpleSlime, { zone: "graveyard" }).map((card) => card.objectId),
        ],
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
  });
});

/** @covers f0ymeslfpw-a2 */
describe("Slime King — Pride 4 and Taunt", () => {
  provePrideAlly({ card: slimeKing, pride: 4, power: 4 });

  it("forces opposing attacks to target the awake Slime King", () => {
    const champion = lineageTestChampion("Slime King", 0);
    const opponentChampion = lineageTestChampion("Slime King opponent", 0);
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        lineage: Array.from({ length: 4 }, (_, index) =>
          lineageTestChampion("Slime King", index + 1),
        ),
        zones: { field: [slimeKing, woodlandSquirrels] },
      },
      playerTwo: { champion: opponentChampion, zones: { field: [woodlandSquirrels] } },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const attacker = opponent.card(woodlandSquirrels);
    const before = game.state;
    expect(() => opponent.declareAttack(attacker, player.card(woodlandSquirrels))).toThrow();
    expect(game.state).toEqual(before);
    opponent.declareAttack(attacker, player.card(slimeKing));
    expect(game.state.combat?.targetIds).toEqual([player.card(slimeKing).objectId]);
  });
});

/** @covers f0ymeslfpw-a1 @covers f0ymeslfpw-a3 */
describe("Slime King — Element Bonus restoration", () => {
  it("pays with three different elements and may return only the chosen banished Slimes", () => {
    const champion = grantTestChampionLevel(
      createClassBonusTestChampion(slimeKing, true, "activation-discount"),
      4,
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [slimeKing, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          graveyard: [babyRedSlime, babyBlueSlime, babyGreenSlime],
          "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [kraalStonescaleTyrant],
          "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const source = player.card(slimeKing, { zone: "hand" });
    const slimes = [
      player.card(babyRedSlime, { zone: "graveyard" }),
      player.card(babyBlueSlime, { zone: "graveyard" }),
      player.card(babyGreenSlime, { zone: "graveyard" }),
    ];
    player.activate(source, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      costSelections: [slimes.map((card) => card.objectId)],
    });
    expect(slimes.map((card) => game.state.objects[card.objectId]!.zone)).toEqual([
      "banishment",
      "banishment",
      "banishment",
    ]);
    passEffectsStack(game);
    expect(
      game.state.objects[source.objectId]!.activationPayment.map((record) => record.objectId),
    ).toEqual(expect.arrayContaining(slimes.map((card) => card.objectId)));
    advanceToMain(game, opponent.id);
    opponent.declareAttack(kraalStonescaleTyrant, source);
    for (
      let step = 0;
      game.state.decision?.kind !== "resolve-effect-choice" && step < 64;
      step += 1
    ) {
      if (game.state.decision?.kind === "choose-retaliators") {
        answerDecision(game, "choose-retaliators", []);
      } else {
        const wait = game.waitState();
        if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
        game.player(wait.playerId).pass();
      }
    }
    expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
    expect(game.state.decision?.kind).toBe("resolve-effect-choice");
    answerDecision(
      game,
      "resolve-effect-choice",
      slimes.slice(0, 2).map((card) => card.objectId),
    );
    passEffectsStack(game);
    expect(slimes.slice(0, 2).map((card) => game.state.objects[card.objectId]!.zone)).toEqual([
      "field",
      "field",
    ]);
    expect(game.state.objects[slimes[2]!.objectId]!.zone).toBe("banishment");
  });
});
