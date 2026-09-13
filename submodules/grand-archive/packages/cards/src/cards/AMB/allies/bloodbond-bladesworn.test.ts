import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { nascentBlast } from "../../P24/actions/nascent-blast.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { bloodbondBladesworn } from "./bloodbond-bladesworn.ts";

/** @covers blyb6fd6vy-a2 */
describe("Bloodbond Bladesworn — mirror damage to champion", () => {
  it("deals the same damage to its controller's champion after it is damaged", () => {
    const champion = createClassBonusTestChampion(
      bloodbondBladesworn,
      false,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: { champion, zones: { field: [bloodbondBladesworn] } },
      playerTwo: { champion, zones: { field: [automatedGardener] } },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const bladesworn = player.card(bloodbondBladesworn, { zone: "field" });
    const ownChampion = player.card(champion, { zone: "field" });
    opponent.declareAttack(automatedGardener, bladesworn);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[bladesworn.objectId]!.damage).toBe(2);
    if (
      game.state.stack.some(
        (item) => item.kind === "triggered-ability" && item.ability.id === "blyb6fd6vy-a2",
      )
    ) {
      expect(game.state.objects[ownChampion.objectId]!.damage).toBe(0);
      passEffectsStack(game);
    }
    expect(game.state.objects[ownChampion.objectId]!.damage).toBe(2);
    expect(game.state.objects[opponent.card(champion).objectId]!.damage).toBe(0);
  });
});

/** @covers blyb6fd6vy-a1 */
describe("Bloodbond Bladesworn — Class Bonus damage-scaled power", () => {
  for (const classBonus of [false, true]) {
    for (const blasts of [3, 4] as const) {
      it(`Class Bonus=${classBonus}, champion damage=${blasts * 3}`, () => {
        const champion = createClassBonusTestChampion(
          bloodbondBladesworn,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: [bloodbondBladesworn],
              "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: {
              hand: [
                ...Array.from({ length: blasts }, () => nascentBlast),
                ...Array.from({ length: blasts * 3 }, () => woodlandSquirrels),
              ],
              "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
            },
          },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const ownChampion = player.card(champion, { zone: "field" });
        for (let i = 0; i < blasts; i++) {
          const wait = game.waitState();
          if (wait.kind === "opportunity" && wait.playerId !== opponent.id)
            game.player(wait.playerId).pass();
          opponent.activate(opponent.cards(nascentBlast, { zone: "hand" })[0]!, {
            targets: { "target-1": [ownChampion.objectId] },
            reservePayment: opponent
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 3)
              .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
          });
          passEffectsStack(game);
        }
        expect(game.state.objects[ownChampion.objectId]!.damage).toBe(blasts * 3);
        passToPlayerMain(game, "player-one");
        const target = opponent.card(champion, { zone: "field" });
        player.declareAttack(bloodbondBladesworn, target);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(
          classBonus && blasts * 3 >= 10 ? 4 : 3,
        );
      });
    }
  }
});

function passToPlayerMain(game: GrandArchiveTestEngine, playerId: string): void {
  for (let step = 0; step < 64; step++) {
    if (game.state.turn.playerId === playerId && game.state.turn.phase === "main") return;
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else if (wait.kind === "game-over") return;
    else throw new Error(`Unexpected ${wait.kind}`);
  }
  throw new Error("Did not reach main");
}
