import { describe } from "vitest";

import { proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { guoJiaHeavensFavored } from "./guo-jia-heavens-favored.ts";

/** @covers enxi6tshtu-a2 */
describe("Guo Jia, Heaven's Favored — Lineage restriction", () => {
  proveChampionLineage({
    card: guoJiaHeavensFavored,
    lineageName: "Guo Jia",
    level: 3,
    memoryCost: 3,
  });
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { fabledEmeraldFatestone } from "../items/fabled-emerald-fatestone.ts";
import { whirlwindThreads } from "../actions/whirlwind-threads.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
/** @covers enxi6tshtu-a1 */
/** @covers enxi6tshtu-a3 */
describe("Guo Jia, Heaven's Favored — real Shenju transformation and materialization", () => {
  for (const scenario of ["none", "item", "one", "two", "opponent"])
    for (const memory of [0, 2, 3, 4])
      for (const accept of [false, true]) {
        it(`Shenju=${scenario}, memory=${memory}, quest choice=${accept}`, () => {
          const starter = enableAllTestElements(lineageTestChampion("Guo Jia", 0)),
            enemy = enableAllTestElements(lineageTestChampion("Opponent", 0));
          const copies = scenario === "two" ? 2 : scenario === "none" ? 0 : 1,
            opposing = scenario === "opponent",
            transformed = scenario !== "item" && scenario !== "none";
          const deck = Array.from({ length: 8 }, () => woodlandSquirrels),
            hand = [
              ...Array.from({ length: 20 }, () => whirlwindThreads),
              ...Array.from({ length: 20 }, () => woodlandSquirrels),
            ];
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: opposing ? "playerTwo" : "playerOne",
            playerOne: {
              champion: starter,
              lineage: [
                enableAllTestElements(lineageTestChampion("Guo Jia", 1)),
                enableAllTestElements(lineageTestChampion("Guo Jia", 2)),
              ],
              zones: {
                field: [
                  woodlandSquirrels,
                  ...Array.from({ length: opposing ? 0 : copies }, () => fabledEmeraldFatestone),
                ],
                hand,
                memory: Array.from({ length: memory }, () => woodlandSquirrels),
                "material-deck": [guoJiaHeavensFavored],
                "main-deck": deck,
              },
            },
            playerTwo: {
              champion: enemy,
              zones: {
                field: opposing ? [fabledEmeraldFatestone] : [],
                hand: opposing ? hand : [],
                "main-deck": deck,
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            actor = opposing ? q : p,
            hero = p.card(starter);
          const thread = (who: typeof p) => {
            who.activate(who.cards(whirlwindThreads, { zone: "hand" })[0]!, {
              reservePayment: [
                {
                  kind: "card",
                  cardId: who.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId,
                },
              ],
            });
            passEffectsStack(game);
          };
          if (transformed)
            for (const stone of actor.cards(fabledEmeraldFatestone, { zone: "field" })) {
              for (let i = 0; i < 8; i++) thread(actor);
              actor.activateAbility(stone, "jz7odeqku4-a4");
              passEffectsStack(game);
              answerDecision(game, "resolve-optional-effect", true);
              passEffectsStack(game);
              expect(game.state.objects[stone.objectId]!.face).toBe("transformed");
            }
          for (let step = 0; step < 128; step++) {
            const wait = game.waitState();
            if (wait.kind === "materialization-choice" && wait.playerId === p.id) break;
            if (game.state.decision?.kind === "order-triggered-abilities")
              answerDecision(
                game,
                "order-triggered-abilities",
                game.state.decision.pendingTriggerIds,
              );
            else if (wait.kind === "materialization-choice")
              game.player(wait.playerId).execute({ move: "skip-materialization" });
            else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
            else throw new Error(`Unexpected ${wait.kind} ${game.state.decision?.kind}`);
          }
          expect(game.waitState().kind).toBe("materialization-choice");
          expect(game.state.turn.playerId).toBe(p.id);
          const available = memory + (transformed && !opposing ? 8 * copies : 0);
          expect(p.zone("memory")).toHaveLength(available);
          const cost = scenario === "one" || scenario === "two" ? 0 : 3,
            before = game.state,
            quests = game.state.objects[hero.objectId]!.counters["named:quest"] ?? 0,
            opponentMemory = q.zone("memory");
          if (available < cost) {
            expect(() => p.materialize(guoJiaHeavensFavored)).toThrow();
            expect(game.state).toEqual(before);
            return;
          }
          p.materialize(guoJiaHeavensFavored);
          expect(p.zone("memory")).toHaveLength(available - cost);
          expect(p.zone("banishment")).toHaveLength(cost);
          expect(q.zone("memory")).toEqual(opponentMemory);
          passEffectsStack(game);
          expect(game.state.objects[hero.objectId]!.activeDefinitionId).toBe(
            guoJiaHeavensFavored.canonicalId,
          );
          expect(game.state.decision?.kind).toBe("resolve-optional-effect");
          answerDecision(game, "resolve-optional-effect", accept);
          passEffectsStack(game);
          expect(game.state.objects[hero.objectId]!.counters["named:quest"] ?? 0).toBe(
            quests + (accept ? 3 : 0),
          );
          expect(game.state.objects[hero.objectId]!.damage).toBe(0);
        });
      }
});

import { fireball } from "../../DOA/actions/fireball.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
describe("Guo Jia, Heaven's Favored — quest counters or recovery", () => {
  for (const accept of [false, true])
    for (const damage of [0, 2, 5]) {
      it(`accept quest counters=${accept}, marked damage=${damage}`, () => {
        const starter = enableAllTestElements(lineageTestChampion("Guo Jia", 0)),
          enemy = enableAllTestElements(lineageTestChampion("Opponent", 0)),
          deck = Array.from({ length: 6 }, () => woodlandSquirrels);
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion: starter,
            lineage: [
              enableAllTestElements(lineageTestChampion("Guo Jia", 1)),
              enableAllTestElements(lineageTestChampion("Guo Jia", 2)),
            ],
            zones: {
              "material-deck": [guoJiaHeavensFavored],
              memory: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              hand: [fireball, sparkAlight, ...Array.from({ length: 6 }, () => woodlandSquirrels)],
              "main-deck": deck,
            },
          },
          playerTwo: { champion: enemy, zones: { "main-deck": deck } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(starter);
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        if (damage > 0) {
          p.activate(sparkAlight, {
            reservePayment: pay(2),
            targets: { "target-1": [hero.objectId] },
          });
          passEffectsStack(game);
        }
        if (damage === 5) {
          p.activate(fireball, {
            reservePayment: pay(4),
            targets: { "target-1": [hero.objectId] },
          });
          passEffectsStack(game);
        }
        expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
        for (let i = 0; i < 128; i++) {
          const wait = game.waitState();
          if (wait.kind === "materialization-choice" && wait.playerId === p.id) break;
          if (wait.kind === "materialization-choice")
            game.player(wait.playerId).execute({ move: "skip-materialization" });
          else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
          else throw new Error(`Unexpected ${wait.kind}`);
        }
        p.materialize(guoJiaHeavensFavored);
        p.pass();
        q.pass();
        expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
        expect(game.state.objects[hero.objectId]!.counters["named:quest"] ?? 0).toBe(0);
        passEffectsStack(game);
        answerDecision(game, "resolve-optional-effect", accept);
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]!.damage).toBe(
          accept ? damage : Math.max(0, damage - 3),
        );
        expect(game.state.objects[hero.objectId]!.counters["named:quest"] ?? 0).toBe(
          accept ? 3 : 0,
        );
        expect(game.state.objects[q.card(enemy).objectId]!.damage).toBe(0);
      });
    }
});
