import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { gustmarkGauge } from "./gustmark-gauge.ts";
import { goldenPawn } from "../allies/golden-pawn.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers cMixAGt8zv-a1 @covers cMixAGt8zv-a2 @covers cMixAGt8zv-a3 */
describe("Gustmark Gauge's Glimpse and state-dependent Chessman bonuses", () => {
  for (const level of [1, 2])
    for (const size of [0, 1, 3])
      for (const bottom of [false, true])
        it(`rests for Glimpse 1 and changes only own Chessman stats: level=${level}, deck=${size}, bottom=${bottom}`, () => {
          const champion = grantTestChampionLevel(
            createClassBonusTestChampion(gustmarkGauge, false, "activation-discount"),
            level,
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [gustmarkGauge, goldenPawn, woodlandSquirrels],
                hand: Array.from({ length: 4 }, () => woodlandSquirrels),
                "main-deck": Array.from({ length: size }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [goldenPawn],
                "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(gustmarkGauge),
            pawn = p.card(goldenPawn);
          const stat = (id: typeof pawn.objectId, property: "power" | "life") =>
            deriveGrandArchiveNumericProperty(game.state.objects[id]!, property, {
              program: game.program,
              state: game.state,
              controllerId: p.id,
              bindings: {},
            });
          const stats = (rested: boolean) => {
            expect(stat(pawn.objectId, "life")).toBe(rested ? 1 : 2);
            expect(stat(pawn.objectId, "power")).toBe(rested && level >= 2 ? 1 : 0);
            expect(stat(q.card(goldenPawn).objectId, "life")).toBe(1);
            expect(stat(q.card(goldenPawn).objectId, "power")).toBe(0);
            expect(stat(p.card(woodlandSquirrels, { zone: "field" }).objectId, "life")).toBe(1);
            expect(stat(p.card(woodlandSquirrels, { zone: "field" }).objectId, "power")).toBe(1);
          };
          stats(false);
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          for (const n of [0, 1, 3]) {
            const before = game.state;
            expect(() =>
              p.activateAbility(source, "cMixAGt8zv-a3", { reservePayment: pay(n) }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          const deck = p.zone("main-deck").map((c) => c.objectId),
            opposingDeck = q.zone("main-deck");
          p.activateAbility(source, "cMixAGt8zv-a3", { reservePayment: pay(2) });
          expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
          expect(p.zone("memory")).toHaveLength(2);
          expect(p.zone("main-deck").map((c) => c.objectId)).toEqual(deck);
          stats(true);
          const after = game.state;
          expect(() =>
            p.activateAbility(source, "cMixAGt8zv-a3", { reservePayment: pay(2) }),
          ).toThrow();
          expect(game.state).toEqual(after);
          passEffectsStack(game);
          if (size) {
            expect(game.state.decision).toMatchObject({
              kind: "resolve-glimpse",
              cardIds: deck.slice(0, 1),
            });
            const before = game.state;
            expect(() =>
              answerDecision(game, "resolve-glimpse", {
                kind: "reorder",
                top: [q.card(goldenPawn).objectId],
                bottom: [],
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
            answerDecision(game, "resolve-glimpse", {
              kind: "reorder",
              top: bottom ? [] : deck.slice(0, 1),
              bottom: bottom ? deck.slice(0, 1) : [],
            });
            passEffectsStack(game);
          } else expect(game.state.decision).toBeNull();
          expect(p.zone("main-deck").map((c) => c.objectId)).toEqual(
            bottom && size ? [...deck.slice(1), deck[0]!] : deck,
          );
          expect(q.zone("main-deck")).toEqual(opposingDeck);
          expect(p.zone("hand")).toHaveLength(2);
          if (size) {
            advanceToMain(game, p.id, game.state.turn.number);
            expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(false);
            stats(false);
            p.activateAbility(source, "cMixAGt8zv-a3", { reservePayment: pay(2) });
            stats(true);
            passEffectsStack(game);
            if (game.state.decision?.kind === "resolve-glimpse") {
              answerDecision(game, "resolve-glimpse", {
                kind: "reorder",
                top: game.state.decision.cardIds,
                bottom: [],
              });
              passEffectsStack(game);
            }
            expect(game.state.stack).toHaveLength(0);
          }
        });

  for (const level of [1, 2])
    it(`removes the life bonus at cost payment and resolves death before Glimpse: level=${level}`, () => {
      const champion = grantTestChampionLevel(
        createClassBonusTestChampion(gustmarkGauge, false, "activation-discount"),
        level,
      );
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: {
            field: [gustmarkGauge, goldenPawn],
            hand: [woodlandSquirrels, woodlandSquirrels],
            "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: { field: [woodlandSquirrels], "main-deck": [woodlandSquirrels] },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        pawn = p.card(goldenPawn);
      q.declareAttack(woodlandSquirrels, pawn);
      game.resolveCombatWithoutRetaliation();
      expect(p.cards(goldenPawn, { zone: "field" })).toEqual([pawn]);
      q.pass();
      const deck = p.zone("main-deck").map((c) => c.objectId),
        hand = p.zone("hand").length;
      p.activateAbility(gustmarkGauge, "cMixAGt8zv-a3", {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      expect(p.cards(goldenPawn, { zone: "graveyard" })).toEqual([pawn]);
      expect(p.zone("hand")).toHaveLength(hand - 2);
      expect(
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === "Lewf9sfv9m-a2",
        ),
      ).toBe(true);
      passEffectsStack(game);
      expect(p.zone("hand").map((c) => c.objectId)).toContain(deck[0]!);
      expect(game.state.decision).toMatchObject({ kind: "resolve-glimpse", cardIds: [deck[1]!] });
      answerDecision(game, "resolve-glimpse", { kind: "reorder", top: [], bottom: [deck[1]!] });
      passEffectsStack(game);
      expect(p.zone("main-deck").map((c) => c.objectId)).toEqual([...deck.slice(2), deck[1]!]);
    });
});
