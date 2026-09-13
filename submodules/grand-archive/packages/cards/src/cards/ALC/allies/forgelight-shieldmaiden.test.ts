import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { airshipEngineer } from "./airship-engineer.ts";
import { forgelightShieldmaiden } from "./forgelight-shieldmaiden.ts";

/** @covers kuz07nk45s-a1 @covers kuz07nk45s-a2 */
describe("Forgelight Shieldmaiden — On Foster filtering", () => {
  for (const deckSize of [0, 1]) {
    it(`loses on the failed draw with ${deckSize} cards remaining`, () => {
      const champion = createClassBonusTestChampion(
        forgelightShieldmaiden,
        true,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [forgelightShieldmaiden],
            hand: [airshipEngineer, woodlandSquirrels],
            "main-deck": Array.from({ length: deckSize }, () => airshipEngineer),
          },
        },
        playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] } },
      });
      const player = game.player("player-one");
      const hand = player.zone("hand");
      const deck = player.zone("main-deck");
      advanceToRecollection(game, player.id);
      passEffectsStack(game);
      expect(game.state.players[player.id]!.lost).toBe(true);
      expect(player.zone("hand")).toEqual([...hand, ...deck]);
      expect(player.zone("graveyard")).toHaveLength(0);
      expect(
        game.state.objects[player.card(forgelightShieldmaiden).objectId]!.counters.buff ?? 0,
      ).toBe(0);
      expect(game.state.eventHistory).toContainEqual(
        expect.objectContaining({ type: "player-lost", playerId: player.id, reason: "deck-out" }),
      );
    });
  }
  for (const classBonus of [false, true]) {
    for (const fire of [false, true]) {
      for (const newlyDrawn of [false, true]) {
        it(`Class Bonus=${classBonus}, discard Fire=${fire}, newly drawn=${newlyDrawn}`, () => {
          const champion = createClassBonusTestChampion(
            forgelightShieldmaiden,
            classBonus,
            "activation-discount",
          );
          const discardedCard = fire ? airshipEngineer : woodlandSquirrels;
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [forgelightShieldmaiden],
                hand: [airshipEngineer, woodlandSquirrels],
                memory: [airshipEngineer],
                "main-deck": Array.from({ length: 5 }, () => discardedCard),
              },
            },
            playerTwo: {
              champion,
              zones: {
                hand: [airshipEngineer],
                "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              },
            },
          });
          const player = game.player("player-one");
          const opponent = game.player("player-two");
          const ally = player.card(forgelightShieldmaiden);
          const buff = () => game.state.objects[ally.objectId]!.counters.buff ?? 0;
          const hand = player.zone("hand");
          const memory = player.zone("memory");
          const deck = player.zone("main-deck");
          const oldChoice = player.card(discardedCard, { zone: "hand" });
          advanceToRecollection(game, opponent.id);
          expect(player.zone("hand")).toEqual(hand);
          expect(game.state.objects[ally.objectId]!.states.has("fostered")).toBe(false);
          advanceToRecollection(game, player.id);
          player.pass();
          opponent.pass();
          expect(game.state.objects[ally.objectId]!.states.has("fostered")).toBe(true);
          expect(
            game.state.stack.some(
              (item) => item.kind === "triggered-ability" && item.ability.id === "kuz07nk45s-a2",
            ),
          ).toBe(true);
          expect(player.zone("hand")).toEqual(hand);
          passEffectsStack(game);
          expect(player.zone("hand")).toEqual([...hand, ...deck.slice(0, 2)]);
          expect(player.zone("main-deck")).toEqual(deck.slice(2));
          expect(player.zone("memory")).toEqual(memory);
          expect(buff()).toBe(0);
          for (const selection of [
            [],
            [ally.objectId],
            [memory[0]!.objectId],
            [opponent.card(airshipEngineer).objectId],
            [hand[0]!.objectId, hand[1]!.objectId],
          ]) {
            const before = game.state;
            expect(() => answerDecision(game, "resolve-effect-choice", selection)).toThrow();
            expect(game.state).toEqual(before);
          }
          const choice = newlyDrawn ? deck[0]! : oldChoice;
          answerDecision(game, "resolve-effect-choice", [choice.objectId]);
          passEffectsStack(game);
          expect(player.zone("graveyard")).toEqual([choice]);
          expect(player.zone("hand")).toEqual(
            [...hand, ...deck.slice(0, 2)].filter((ref) => ref.objectId !== choice.objectId),
          );
          expect(buff()).toBe(classBonus && fire ? 1 : 0);
          for (let step = 0; game.state.turn.phase !== "main" && step < 16; step++) {
            const wait = game.waitState();
            if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
            game.player(wait.playerId).pass();
          }
          const target = opponent.card(champion);
          player.declareAttack(ally, target);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[target.objectId]!.damage).toBe(classBonus && fire ? 2 : 1);
          advanceToRecollection(game, opponent.id);
          advanceToRecollection(game, player.id);
          const beforeRepeat = player.zone("hand");
          passEffectsStack(game);
          expect(player.zone("hand")).toEqual(beforeRepeat);
          expect(game.state.stack).toHaveLength(0);
          expect(game.state.decision).toBeNull();
          expect(buff()).toBe(classBonus && fire ? 1 : 0);
        });
      }
    }
  }
});
