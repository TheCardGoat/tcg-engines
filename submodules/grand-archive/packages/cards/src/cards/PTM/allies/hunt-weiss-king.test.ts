import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { huntWeissKing } from "./hunt-weiss-king.ts";
import { createLineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { goldenPawn } from "./golden-pawn.ts";
import { weissKnight } from "./weiss-knight.ts";

/** @covers Y6PZntlVDl-a1 */
describe("Hunt, Weiss King — controlled Pawn discount capped at two", () => {
  for (const matching of [false, true])
    for (const own of [0, 1, 2, 3])
      for (const opposing of [0, 3]) {
        it(`Alice=${matching}, own Pawns=${own}, opposing Pawns=${opposing}`, () => {
          const champion = enableAllTestElements(
            createLineageTestChampion(huntWeissKing, matching ? "Alice" : "Other"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  huntWeissKing,
                  goldenPawn,
                  ...Array.from({ length: 7 }, () => woodlandSquirrels),
                ],
                field: [
                  weissKnight,
                  woodlandSquirrels,
                  ...Array.from({ length: own }, () => goldenPawn),
                ],
                graveyard: [goldenPawn],
              },
            },
            playerTwo: {
              champion,
              zones: { field: Array.from({ length: opposing }, () => goldenPawn) },
            },
          });
          const p = game.player("player-one"),
            source = p.card(huntWeissKing);
          const cost = matching ? 6 - 2 * Math.min(own, 2) : 6;
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const before = game.state;
          for (const amount of [cost - 1, cost + 1]) {
            expect(() => p.activate(source, { reservePayment: pay(amount) })).toThrow();
            expect(game.state).toEqual(before);
          }
          p.activate(source, { reservePayment: pay(cost) });
          expect(p.zone("memory")).toHaveLength(cost);
          expect(game.state.objects[source.objectId]!.zone).toBe("effects-stack");
          passEffectsStack(game);
          expect(game.state.objects[source.objectId]!.zone).toBe("field");
          expect(game.state.decision).toBeNull();
        });
      }
});
import { answerDecision, advanceToMain } from "../../../testing/decisions.ts";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { turmSchwartzRook } from "./turm-schwartz-rook.ts";
import { draughtOfStamina } from "../../PRD/items/draught-of-stamina.ts";

/** @covers Y6PZntlVDl-a2 */
describe("Hunt, Weiss King — Knight choice and Rook redirection", () => {
  for (const destination of ["none", "own", "opponent"] as const) {
    it(`chooses a Knight on resolution without targeting: ${destination}`, () => {
      const champion = enableAllTestElements(createLineageTestChampion(huntWeissKing, "Alice"));
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [
              huntWeissKing,
              giantTortoise,
              draughtOfStamina,
              ...(destination === "own" ? [weissKnight] : []),
            ],
            "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [giantTortoise, ...(destination === "opponent" ? [weissKnight] : [])],
            "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(huntWeissKing);
      p.activateAbility(source, "Y6PZntlVDl-a2", { modeIds: ["mode-2"] });
      expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
      passEffectsStack(game);
      if (destination !== "none") {
        const target = (destination === "own" ? p : q).card(weissKnight);
        const before = game.state;
        for (const ids of [
          [],
          [p.card(giantTortoise).objectId],
          [q.card(giantTortoise).objectId],
          [source.objectId],
          [p.card(champion).objectId],
        ]) {
          expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
          expect(game.state).toEqual(before);
        }
        answerDecision(game, "resolve-effect-choice", [target.objectId]);
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.counters.buff).toBe(1);
      }
      expect(game.state.decision).toBeNull();
      p.activateAbility(draughtOfStamina, "lpnvx7mnu1-a2", {
        targets: { "target-1": [source.objectId] },
      });
      passEffectsStack(game);
      const before = game.state;
      expect(() => p.activateAbility(source, "Y6PZntlVDl-a2", { modeIds: ["mode-2"] })).toThrow();
      expect(game.state).toEqual(before);
      advanceToMain(game, p.id, game.state.turn.number);
      const nextTurn = game.state;
      expect(() => p.activateAbility(source, "Y6PZntlVDl-a2", { modeIds: ["mode-2"] })).toThrow();
      expect(game.state).toEqual(nextTurn);
    });
  }
  for (const attack of [false, true]) {
    it(`gives the chosen Rook life only after redirecting: attack=${attack}`, () => {
      const champion = enableAllTestElements(createLineageTestChampion(huntWeissKing, "Alice"));
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: attack ? "playerTwo" : "playerOne",
        playerOne: {
          champion,
          zones: {
            field: [huntWeissKing, turmSchwartzRook, giantTortoise],
            "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [giantTortoise, turmSchwartzRook],
            "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(huntWeissKing),
        rook = p.card(turmSchwartzRook),
        hero = p.card(champion);
      if (attack) {
        q.declareAttack(q.card(giantTortoise), hero);
        q.pass();
      }
      p.activateAbility(source, "Y6PZntlVDl-a2", { modeIds: ["mode-3"] });
      passEffectsStack(game);
      const before = game.state;
      for (const ids of [
        [],
        [hero.objectId],
        [p.card(giantTortoise).objectId],
        [q.card(turmSchwartzRook).objectId],
      ]) {
        expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
        expect(game.state).toEqual(before);
      }
      answerDecision(game, "resolve-effect-choice", [rook.objectId]);
      passEffectsStack(game);
      const life = () =>
        deriveGrandArchiveNumericProperty(game.state.objects[rook.objectId]!, "life", {
          program: game.program,
          state: game.state,
          controllerId: p.id,
          bindings: {},
        });
      expect(life()).toBe(attack ? 5 : 3);
      if (attack) {
        expect(game.state.combat!.targetIds).toEqual([rook.objectId]);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[hero.objectId]!.damage).toBe(0);
        expect(game.state.objects[rook.objectId]!.damage).toBe(1);
      }
      advanceToMain(game, attack ? p.id : q.id);
      expect(life()).toBe(3);
    });
  }
});

import { weissBishop } from "./weiss-bishop.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { grantTestChampionLevel } from "../../../testing/class-bonus-test-champion.ts";

/** @covers Y6PZntlVDl-a2 */
describe("Hunt, Weiss King — Bishop condition at resolution", () => {
  for (const matching of [false, true])
    for (const location of ["none", "own", "opponent"] as const)
      for (const removed of location === "none" ? [false] : [false, true])
        for (const deckSize of [0, 2]) {
          it(`Alice=${matching}, Bishop=${location}, removed=${removed}, deck=${deckSize}`, () => {
            const champion = enableAllTestElements(
              grantTestChampionLevel(
                createLineageTestChampion(huntWeissKing, matching ? "Alice" : "Other"),
                3,
              ),
            );
            const game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: {
                  field: [huntWeissKing, ...(location === "own" ? [weissBishop] : [])],
                  hand: [fireball, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
                  "main-deck": Array.from({ length: deckSize }, () => woodlandSquirrels),
                },
              },
              playerTwo: {
                champion,
                zones: {
                  field: location === "opponent" ? [weissBishop] : [],
                  "main-deck": [woodlandSquirrels],
                },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              source = p.card(huntWeissKing);
            const deck = p.zone("main-deck"),
              otherDeck = q.zone("main-deck");
            p.activateAbility(source, "Y6PZntlVDl-a2", { modeIds: ["mode-1"] });
            expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
            expect(p.zone("main-deck")).toEqual(deck);
            if (removed)
              p.activate(fireball, {
                targets: { "target-1": [(location === "own" ? p : q).card(weissBishop).objectId] },
                reservePayment: p
                  .cards(woodlandSquirrels, { zone: "hand" })
                  .map((c) => ({ kind: "card", cardId: c.objectId })),
              });
            passEffectsStack(game);
            const draws = location === "own" && !removed;
            if (deck.length)
              expect(game.state.objects[deck[0]!.objectId]!.zone).toBe(
                draws ? "hand" : "main-deck",
              );
            expect(game.state.winnerIds).toEqual(draws && deckSize === 0 ? [q.id] : []);
            expect(q.zone("main-deck")).toEqual(otherDeck);
            expect(game.state.decision).toBeNull();
          });
        }
});
