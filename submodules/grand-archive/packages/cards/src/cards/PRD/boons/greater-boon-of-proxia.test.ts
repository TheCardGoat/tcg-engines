import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { type GrandArchivePantheonPlayerSetup } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { greaterBoonOfProxia } from "./greater-boon-of-proxia.ts";
import { lesserBoonOfApollo } from "../../PP1/boons/lesser-boon-of-apollo.ts";
import { greaterBoonOfHorses } from "../../PP1/boons/greater-boon-of-horses.ts";
import { pantheonBarrier } from "../../PP1/tokens/pantheon-barrier.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { grandArchiveTestFace } from "../../../testing/class-bonus-test-champion.ts";
import { grandArchiveCards } from "../../../generated/grand-archive-card-registry.ts";

/** @covers WKA37tNxtw-a1 */
describe("Greater Boon of Proxia — per-player starting deck limit", () => {
  // Real, distinct Main Deck cards keep full deck validation enabled.
  const seen = new Set<string>();
  const main = grandArchiveCards
    .filter((card) => {
      const face = grandArchiveTestFace(card);
      if (
        card.definitionKind !== "card" ||
        card.formatRestriction ||
        !face.typeLine.types.includes("ACTION") ||
        seen.has(face.name)
      )
        return false;
      seen.add(face.name);
      return true;
    })
    .slice(0, 60);
  const material = Array.from({ length: 16 }, (_, n) => lineageTestChampion(`Deck limit ${n}`, 0));
  const starter = material[0]!;
  for (const included of [false, true])
    for (const size of [11, 12, 13, 14, 15, 16]) {
      it(`allows ${included ? 15 : 12} material cards only for its owner: size=${size}`, () => {
        const setup = (
          id: string,
          ownsProxia: boolean,
          count: number,
        ): GrandArchivePantheonPlayerSetup => ({
          id,
          name: id,
          startingChampionDefinitionId: starter.canonicalId,
          mainDeck: main.map((card) => ({ definitionId: card.canonicalId, count: 1 })),
          materialDeck: material
            .slice(0, count)
            .map((card) => ({ definitionId: card.canonicalId, count: 1 })),
          pantheon: {
            lesserBoonDefinitionId: lesserBoonOfApollo.canonicalId,
            greaterBoonDefinitionId: (ownsProxia ? greaterBoonOfProxia : greaterBoonOfHorses)
              .canonicalId,
            barrierDefinitionId: pantheonBarrier.canonicalId,
          },
        });
        const start = () =>
          GrandArchiveTestEngine.start(
            [
              ...main,
              ...material,
              lesserBoonOfApollo,
              greaterBoonOfProxia,
              greaterBoonOfHorses,
              pantheonBarrier,
            ],
            {
              mode: "pantheon",
              players: [
                setup("player-one", included, size),
                setup("player-two", true, 15),
                setup("player-three", false, 12),
              ],
              firstPlayerId: "player-one",
              randomSeed: 17,
            },
          );
        if (size < 12 || size > (included ? 15 : 12)) {
          expect(start).toThrow(
            `Pantheon material deck must contain between 12 and ${included ? 15 : 12} cards`,
          );
          return;
        }
        const game = start();
        expect(game.state.status).toBe("pregame");
        expect(game.player("player-one").zone("material-deck")).toHaveLength(size);
        expect(game.player("player-two").zone("material-deck")).toHaveLength(15);
        expect(game.player("player-three").zone("material-deck")).toHaveLength(12);
      });
    }
});

import { pantheonStartFixture } from "../../../testing/pantheon-start-fixture.ts";
/** @covers WKA37tNxtw-a2 */
describe("Greater Boon of Proxia — First Boon", () => {
  for (const four of [false, true])
    for (const first of ["player-one", "player-two"]) {
      it(`requires each player's bestowment before Spirits enter: four=${four}, first=${first}`, () => {
        const { game, champion } = pantheonStartFixture(four, first);
        for (const id of game.state.turnOrder) {
          const player = game.player(id),
            source = player.card(greaterBoonOfProxia);
          const other = game.player(game.state.turnOrder.find((other) => other !== id)!);
          expect(game.state.objects[source.objectId]!.facing).toBe("face-down");
          for (const command of [
            { move: "complete-pregame-actions" as const },
            { move: "bestow-boon" as const, cardId: other.card(greaterBoonOfProxia).objectId },
            { move: "bestow-boon" as const, cardId: player.card(lesserBoonOfApollo).objectId },
          ]) {
            const before = game.state;
            expect(() => player.execute(command)).toThrow();
            expect(game.state).toEqual(before);
          }
          for (const owner of game.state.turnOrder)
            expect(game.player(owner).cards(champion, { zone: "field" })).toHaveLength(0);
          player.execute({ move: "bestow-boon", cardId: source.objectId });
          expect(game.state.objects[source.objectId]).toMatchObject({
            zone: "pantheon",
            facing: "face-up",
          });
          expect(player.zone("hand")).toHaveLength(0);
          expect(player.zone("memory")).toHaveLength(0);
          expect(game.state.stack).toHaveLength(0);
          const before = game.state;
          expect(() => player.execute({ move: "bestow-boon", cardId: source.objectId })).toThrow();
          expect(game.state).toEqual(before);
          player.execute({ move: "complete-pregame-actions" });
        }
        expect(game.state.status).toBe("playing");
        for (const id of game.state.turnOrder)
          expect(game.player(id).cards(champion, { zone: "field" })).toHaveLength(1);
      });
    }
});

import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers WKA37tNxtw-a3 */
describe("Greater Boon of Proxia — regalia discount and once-only draw", () => {
  for (const own of [0, 1, 3, 10, 12])
    for (const opposing of [0, 2]) {
      it(`counts only controlled regalia and clamps the cost at zero: own=${own}, opposing=${opposing}`, () => {
        const { game } = pantheonStartFixture(false, "player-one", { own, opponent: opposing });
        for (const id of game.state.turnOrder) {
          const player = game.player(id);
          player.execute({
            move: "bestow-boon",
            cardId: player.card(greaterBoonOfProxia).objectId,
          });
          player.execute({ move: "complete-pregame-actions" });
        }
        const p = game.player("player-one"),
          q = game.player("player-two");
        // Materialize each real regalia through the normal phase and gather enough reserve cards.
        for (let round = 0; round < 14; round++) {
          const turn = game.state.turn.number;
          for (let step = 0; step < 256; step++) {
            if (
              game.state.turn.number > turn &&
              game.state.turn.playerId === p.id &&
              game.state.turn.phase === "main"
            )
              break;
            const wait = game.waitState();
            if (wait.kind === "materialization-choice") {
              const player = game.player(wait.playerId),
                sword = player.cards(trainingSword, { zone: "material-deck" })[0];
              if (sword) player.materialize(sword);
              else player.execute({ move: "skip-materialization" });
            } else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
            else throw new Error(`Unexpected ${wait.kind} while materializing regalia`);
          }
          expect(game.state.turn.playerId).toBe(p.id);
          expect(game.state.turn.phase).toBe("main");
          expect(game.state.turn.number).toBeGreaterThan(turn);
        }
        expect(p.cards(trainingSword, { zone: "field" })).toHaveLength(own);
        expect(q.cards(trainingSword, { zone: "field" })).toHaveLength(opposing);
        for (let n = 0; n < 2; n++) {
          p.activate(p.cards(woodlandSquirrels, { zone: "hand" })[0]!);
          passEffectsStack(game);
        }
        const source = p.card(greaterBoonOfProxia),
          cost = Math.max(0, 10 - own);
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const before = game.state;
        for (const amount of cost > 0 ? [cost - 1, cost + 1] : [1]) {
          expect(() =>
            p.activateAbility(source, "WKA37tNxtw-a3", { reservePayment: pay(amount) }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        expect(() =>
          p.activateAbility(q.card(greaterBoonOfProxia), "WKA37tNxtw-a3", {
            reservePayment: pay(cost),
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        const deck = p.zone("main-deck"),
          opposingDeck = q.zone("main-deck"),
          hand = p.zone("hand");
        p.activateAbility(source, "WKA37tNxtw-a3", { reservePayment: pay(cost) });
        expect(p.zone("memory")).toHaveLength(cost);
        expect(p.zone("main-deck")).toEqual(deck);
        const activated = game.state;
        expect(() =>
          p.activateAbility(source, "WKA37tNxtw-a3", { reservePayment: pay(cost) }),
        ).toThrow();
        expect(game.state).toEqual(activated);
        passEffectsStack(game);
        expect(p.zone("hand")).toHaveLength(hand.length - cost + 1);
        expect(game.state.objects[deck[0]!.objectId]!.zone).toBe("hand");
        expect(p.zone("main-deck")).toEqual(deck.slice(1));
        expect(q.zone("main-deck")).toEqual(opposingDeck);
        advanceToMain(game, p.id, game.state.turn.number);
        const nextTurn = game.state;
        expect(() =>
          p.activateAbility(source, "WKA37tNxtw-a3", { reservePayment: pay(cost) }),
        ).toThrow();
        expect(game.state).toEqual(nextTurn);
      });
    }
});
