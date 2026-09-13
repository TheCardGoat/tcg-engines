import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { palaceGuard } from "../allies/palace-guard.ts";
import { invectiveInstruction } from "./invective-instruction.ts";

function payment(game: GrandArchiveTestEngine) {
  return game
    .player("player-one")
    .cards(woodlandSquirrels, { zone: "hand" })
    .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
}

/** @covers smr2rn78qo-a1 */
describe("Invective Instruction — +3 POWER", () => {
  it("grants three power to an ally and rejects a champion target", () => {
    const champion = createClassBonusTestChampion(
      invectiveInstruction,
      false,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [invectiveInstruction, woodlandSquirrels, woodlandSquirrels],
          field: [woodlandSquirrels],
        },
      },
      playerTwo: { champion, zones: { field: [woodlandSquirrels] } },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const ally = player.card(woodlandSquirrels, { zone: "field" });
    const before = game.state;
    expect(() =>
      player.activate(invectiveInstruction, {
        reservePayment: payment(game),
        targets: { "target-1": [player.card(champion, { zone: "field" }).objectId] },
      }),
    ).toThrow();
    expect(game.state).toEqual(before);

    player.activate(invectiveInstruction, {
      reservePayment: payment(game),
      targets: { "target-1": [ally.objectId] },
    });
    passEffectsStack(game);
    player.declareAttack(ally, opponent.card(champion, { zone: "field" }));
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[opponent.card(champion, { zone: "field" }).objectId]!.damage).toBe(4);
  });
});

/** @covers smr2rn78qo-a2 */
describe("Invective Instruction — Class Bonus non-Human draw", () => {
  it("draws into memory only with Class Bonus and a controlled non-Human ally", () => {
    for (const classBonus of [false, true]) {
      for (const nonHuman of [false, true]) {
        const champion = createClassBonusTestChampion(
          invectiveInstruction,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [invectiveInstruction, woodlandSquirrels, woodlandSquirrels],
              field: [nonHuman ? woodlandSquirrels : palaceGuard],
              "main-deck": [woodlandSquirrels],
            },
          },
          playerTwo: { champion },
        });
        const player = game.player("player-one");
        const deck = player.zone("main-deck");
        const ally = player.card(nonHuman ? woodlandSquirrels : palaceGuard, { zone: "field" });
        player.activate(invectiveInstruction, {
          reservePayment: payment(game),
          targets: { "target-1": [ally.objectId] },
        });
        passEffectsStack(game);
        if (classBonus && nonHuman) {
          expect(player.zone("memory")).toContainEqual(deck[0]);
          expect(player.zone("main-deck")).toEqual(deck.slice(1));
        } else {
          expect(player.zone("memory")).toHaveLength(2);
          expect(player.zone("main-deck")).toEqual(deck);
        }
      }
    }
  });
});
