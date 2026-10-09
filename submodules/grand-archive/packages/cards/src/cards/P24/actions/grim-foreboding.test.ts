import { describe } from "vitest";
import { grimForeboding } from "./grim-foreboding.ts";
import { proveTristanShadowSummon } from "../../../testing/tristan-shadow-summon.ts";
/** @covers 4hnf1yyx1q-a1 */
describe("grim-foreboding — Tristan summon", () =>
  proveTristanShadowSummon(grimForeboding, 3, false));
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { deepSeaFractal } from "../../FTC/phantasias/deep-sea-fractal.ts";
import { scepterOfAwakening } from "../../HVN/items/scepter-of-awakening.ts";
/** @covers 4hnf1yyx1q-a2 */
describe("Grim Foreboding — existing Phantasia allies and Agility", () => {
  for (const matching of [false, true])
    for (const ownTurn of [false, true])
      it(`class=${matching}, own turn=${ownTurn}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(grimForeboding, matching, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: ownTurn ? "playerOne" : "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: [
                woodlandSquirrels,
                deepSeaFractal,
                deepSeaFractal,
                scepterOfAwakening,
                scepterOfAwakening,
              ],
              hand: [grimForeboding, ...Array.from({ length: 12 }, () => woodlandSquirrels)],
              "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [woodlandSquirrels],
              "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const [early, late] = p.cards(deepSeaFractal),
          scepters = p.cards(scepterOfAwakening);
        if (!early || !late) throw new Error("Missing phantasias");
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const opportunity = () => {
          const wait = game.waitState();
          if (wait.kind === "opportunity" && wait.playerId === q.id) q.pass();
        };
        const power = (id: typeof early.objectId) =>
          deriveGrandArchiveNumericProperty(game.state.objects[id]!, "power", {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          });
        const animate = (index: number, target: typeof early) => {
          opportunity();
          p.activateAbility(scepters[index]!, "2zh208013h-a2", {
            reservePayment: pay(2),
            targets: { "target-phantasia": [target.objectId] },
          });
          passEffectsStack(game);
        };
        animate(0, early);
        opportunity();
        p.activate(grimForeboding, { reservePayment: pay(3) });
        passEffectsStack(game);
        expect(power(early.objectId)).toBe(4);
        expect(power(p.card(woodlandSquirrels, { zone: "field" }).objectId)).toBe(1);
        expect(power(q.card(woodlandSquirrels).objectId)).toBe(1);
        animate(1, late);
        expect(power(late.objectId)).toBe(3);
        expect(game.state.players[p.id]?.states.agility).toBe(true);
        expect(game.state.players[q.id]?.states.agility).not.toBe(true);
        const memory = p.zone("memory"),
          hand = p.zone("hand"),
          deck = p.zone("main-deck");
        for (let i = 0; i < 32 && !game.state.decision; i++) {
          const wait = game.waitState();
          if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
          game.player(wait.playerId).pass();
        }
        expect(game.state.decision).toMatchObject({
          kind: "resolve-effect-choice",
          playerId: p.id,
        });
        expect(game.state.turn.phase).toBe("end");
        const before = game.state;
        for (const count of [0, 2, 4]) {
          expect(() =>
            answerDecision(
              game,
              "resolve-effect-choice",
              memory.slice(0, count).map((c) => c.objectId),
            ),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        const selected = memory.slice(-3).reverse();
        answerDecision(
          game,
          "resolve-effect-choice",
          selected.map((c) => c.objectId),
        );
        passEffectsStack(game);
        expect(p.zone("memory")).toEqual(memory.slice(0, -3));
        expect(p.zone("hand")).toEqual([...hand, ...selected]);
        expect(p.zone("main-deck")).toEqual(deck);
        advanceToMain(game, p.id, game.state.turn.number);
        expect(game.state.players[p.id]?.states.agility).toBe(false);
        animate(0, early);
        expect(power(early.objectId)).toBe(4);
      });
});
