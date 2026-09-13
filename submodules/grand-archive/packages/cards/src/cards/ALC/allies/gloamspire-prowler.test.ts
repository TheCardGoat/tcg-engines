import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { umbraSight } from "../actions/umbra-sight.ts";
import { automatedGardener } from "./automated-gardener.ts";
import { gloamspireProwler } from "./gloamspire-prowler.ts";

function addCurses(game: GrandArchiveTestEngine, count: number) {
  const player = game.player("player-one");
  for (let i = 0; i < count; i++) {
    player.activate(player.cards(umbraSight, { zone: "hand" })[0]!);
    passEffectsStack(game);
    answerDecision(game, "resolve-optional-effect", true);
    passEffectsStack(game);
  }
}

/** @covers igpck2z4rs-a1 */
describe("Gloamspire Prowler — two-Curse activation threshold", () => {
  for (const classBonus of [false, true])
    for (const curses of [0, 1, 2, 3]) {
      it(`Class Bonus=${classBonus}, lineage Curses=${curses}`, () => {
        const champion = createClassBonusTestChampion(
          gloamspireProwler,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                gloamspireProwler,
                ...Array.from({ length: curses }, () => umbraSight),
                ...Array.from({ length: 4 }, () => woodlandSquirrels),
              ],
              graveyard: [umbraSight, umbraSight],
              field: [gloamspireProwler],
              "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
            },
          },
          playerTwo: { champion },
        });
        const player = game.player("player-one");
        addCurses(game, curses);
        expect(player.zone("inner-lineage")).toHaveLength(curses);
        const source = player.card(gloamspireProwler, { zone: "hand" });
        const cost = curses >= 2 ? 1 : 4;
        const payment = player.cards(woodlandSquirrels, { zone: "hand" }).slice(0, cost);
        const memory = player.zone("memory");
        const before = game.state;
        expect(() =>
          player.activate(source, {
            reservePayment: payment.slice(1).map((ref) => ({ kind: "card", cardId: ref.objectId })),
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        player.activate(source, {
          reservePayment: payment.map((ref) => ({ kind: "card", cardId: ref.objectId })),
        });
        expect(player.zone("memory")).toEqual([...memory, ...payment]);
        expect(player.cards(gloamspireProwler, { zone: "field" })).toHaveLength(1);
        passEffectsStack(game);
        expect(player.cards(gloamspireProwler, { zone: "field" })).toHaveLength(2);
      });
    }
});

/** @covers igpck2z4rs-a2 @covers igpck2z4rs-a3 */
describe("Gloamspire Prowler — death, recovery, and inherited life", () => {
  for (const classBonus of [false, true])
    for (const curses of [0, 1, 3]) {
      it(`Class Bonus=${classBonus}, prior Curse cards=${curses}`, () => {
        const champion = createClassBonusTestChampion(
          gloamspireProwler,
          classBonus,
          "activation-discount",
        );
        const enemyChampion = createClassBonusTestChampion(
          gloamspireProwler,
          false,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [gloamspireProwler],
              hand: Array.from({ length: curses }, () => umbraSight),
              "main-deck": Array.from({ length: 10 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion: enemyChampion,
            zones: {
              field: [gloamspireProwler, automatedGardener, woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const ownChampion = player.card(champion);
        addCurses(game, curses);
        const damage = curses === 3 ? 12 : curses === 1 ? 2 : 0;
        expect(game.state.objects[ownChampion.objectId]!.damage).toBe(damage);
        expect(game.state.players[player.id]!.lost).toBe(false);
        const prowler = player.card(gloamspireProwler);
        const defender = opponent.card(gloamspireProwler);
        const hand = player.zone("hand");
        const deck = player.zone("main-deck");
        const lineage = player.zone("inner-lineage");
        player.declareAttack(prowler, defender);
        for (let step = 0; step < 64 && game.state.combat; step++) {
          if (
            game.state.stack.some(
              (item) => item.kind === "triggered-ability" && item.ability.id === "igpck2z4rs-a2",
            )
          )
            break;
          if (game.state.decision?.kind === "choose-retaliators")
            answerDecision(game, "choose-retaliators", [defender.objectId]);
          else {
            const wait = game.waitState();
            if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
            game.player(wait.playerId).pass();
          }
        }
        expect(player.zone("graveyard")).toEqual([prowler]);
        expect(player.zone("inner-lineage")).toEqual(lineage);
        expect(player.zone("hand")).toEqual(hand);
        expect(game.state.objects[ownChampion.objectId]!.damage).toBe(damage);
        expect(game.state.stack.filter((item) => item.kind === "triggered-ability")).toHaveLength(
          classBonus ? 1 : 0,
        );
        passEffectsStack(game);
        expect(player.zone("inner-lineage")).toEqual(classBonus ? [...lineage, prowler] : lineage);
        expect(player.zone("graveyard")).toEqual(classBonus ? [] : [prowler]);
        if (classBonus)
          expect(game.state.objects[prowler.objectId]!.hostId).toBe(ownChampion.objectId);
        expect(player.zone("hand")).toEqual(classBonus ? [...hand, deck[0]] : hand);
        expect(player.zone("main-deck")).toEqual(classBonus ? deck.slice(1) : deck);
        expect(game.state.objects[ownChampion.objectId]!.damage).toBe(
          classBonus ? Math.max(0, damage - 2) : damage,
        );
        expect(opponent.zone("graveyard")).toEqual([defender]);
        if (game.state.combat) game.resolveCombatWithoutRetaliation();
        if (curses === 3) {
          advanceToRecollection(game, opponent.id);
          for (let step = 0; game.state.turn.phase !== "main" && step < 24; step++) {
            const wait = game.waitState();
            if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
            game.player(wait.playerId).pass();
          }
          opponent.declareAttack(automatedGardener, ownChampion);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[ownChampion.objectId]!.damage).toBe(classBonus ? 12 : 14);
          expect(game.state.players[player.id]!.lost).toBe(false);
          const wait = game.waitState();
          if (wait.kind === "opportunity" && wait.playerId !== opponent.id)
            game.player(wait.playerId).pass();
          opponent.declareAttack(opponent.card(woodlandSquirrels, { zone: "field" }), ownChampion);
          for (let step = 0; !game.state.players[player.id]!.lost && step < 64; step++) {
            if (game.state.decision?.kind === "choose-retaliators")
              answerDecision(game, "choose-retaliators", []);
            else {
              const next = game.waitState();
              if (next.kind !== "opportunity") throw new Error(`Unexpected ${next.kind}`);
              game.player(next.playerId).pass();
            }
          }
          expect(game.state.players[player.id]!.lost).toBe(true);
        }
      });
    }
});
