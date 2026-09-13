import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { nascentBlast } from "../../P24/actions/nascent-blast.ts";
import { automatedGardener } from "../allies/automated-gardener.ts";
import { provokeObstinance } from "./provoke-obstinance.ts";

/** @covers 16r0zadf9q-a1 */
describe("Provoke Obstinance — Class Bonus one-target draw", () => {
  for (const [classMatches, targets, expectedMemory] of [
    [true, 1, 4],
    [true, 2, 3],
    [false, 1, 3],
  ] as const) {
    it(`class match=${classMatches}, targets=${targets}`, () => {
      const champion = createClassBonusTestChampion(
        provokeObstinance,
        classMatches,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [provokeObstinance, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            field: [woodlandSquirrels],
            "main-deck": [woodlandSquirrels],
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      const targetIds = [
        player.card(champion, { zone: "field" }).objectId,
        player.card(woodlandSquirrels, { zone: "field" }).objectId,
      ].slice(0, targets);
      player.activate(provokeObstinance, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((card) => ({ kind: "card", cardId: card.objectId })),
        targets: { "target-objects": targetIds },
      });
      passEffectsStack(game);
      expect(player.zone("memory")).toHaveLength(expectedMemory);
    });
  }
});

/** @covers 16r0zadf9q-a2 */
describe("Provoke Obstinance — spellshroud and per-unit prevention", () => {
  it("protects the chosen object from Spells and prevents two damage once", () => {
    const champion = createClassBonusTestChampion(provokeObstinance, true, "activation-discount");
    const opposingChampion = createClassBonusTestChampion(
      nascentBlast,
      false,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: {
          hand: [provokeObstinance, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          "main-deck": [woodlandSquirrels],
        },
      },
      playerTwo: {
        champion: opposingChampion,
        zones: {
          hand: [nascentBlast, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          field: [automatedGardener, automatedGardener],
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const target = player.card(champion, { zone: "field" });
    opponent.pass();
    player.activate(provokeObstinance, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card", cardId: card.objectId })),
      targets: { "target-objects": [target.objectId] },
    });
    passEffectsStack(game);

    const beforeSpell = game.state;
    expect(() =>
      opponent.activate(nascentBlast, {
        reservePayment: opponent
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((card) => ({ kind: "card", cardId: card.objectId })),
        targets: { "target-1": [target.objectId] },
      }),
    ).toThrow();
    expect(game.state).toEqual(beforeSpell);

    for (const attacker of opponent.cards(automatedGardener, { zone: "field" })) {
      opponent.declareAttack(attacker, target);
      game.resolveCombatWithoutRetaliation();
    }
    expect(game.state.objects[target.objectId]!.damage).toBe(2);
  });
});
