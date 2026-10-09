import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { submergedFatestone } from "./submerged-fatestone.ts";
import { reclaim } from "../../DOA/actions/reclaim.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { breakApart } from "../../P26/actions/break-apart.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createLineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  enableAllTestElements,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { advanceToRecollection } from "../../../testing/shifting-currents.ts";

/** @covers zfb0pzm6qp-a1 */
/** @covers l5nqwq5ujh-a1 */
/** @covers zfb0pzm6qp-a2 */
describe("Submerged Fatestone keeps its opposing level reduction through transformation", () => {
  for (const level of [0, 1, 3])
    for (const transform of [false, true])
      it(`opposing level=${level}, transform=${transform}`, () => {
        const champion = grantTestChampionLevel(
          enableAllTestElements(createLineageTestChampion(submergedFatestone, "Guo Jia")),
          4,
        );
        const opponent = grantTestChampionLevel(
          enableAllTestElements(createLineageTestChampion(submergedFatestone, "Other")),
          level,
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                submergedFatestone,
                fireball,
                breakApart,
                ...Array.from({ length: 7 }, () => woodlandSquirrels),
              ],
              graveyard: [reclaim, reclaim, woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion: opponent,
            zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const own = p.card(champion),
          foe = q.card(opponent),
          source = p.card(submergedFatestone),
          fuel = p.cards(reclaim)[0]!;
        const lv = (id: typeof own.objectId) =>
          deriveGrandArchiveNumericProperty(game.state.objects[id]!, "level", {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          });
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        expect(lv(foe.objectId)).toBe(level);
        p.activate(source, { reservePayment: pay(2) });
        passEffectsStack(game);
        expect(lv(foe.objectId)).toBe(level - 1);
        expect(lv(own.objectId)).toBe(4);
        advanceToRecollection(game, p.id);
        passEffectsStack(game);
        answerDecision(game, "resolve-optional-effect", transform);
        passEffectsStack(game);
        if (transform) {
          expect(game.state.decision?.kind).toBe("resolve-effect-choice");
          const before = game.state;
          expect(() =>
            answerDecision(game, "resolve-effect-choice", [
              p.card(woodlandSquirrels, { zone: "graveyard" }).objectId,
            ]),
          ).toThrow();
          expect(game.state).toEqual(before);
          answerDecision(game, "resolve-effect-choice", [fuel.objectId]);
          passEffectsStack(game);
          expect(p.cards(reclaim, { zone: "graveyard" })).toHaveLength(1);
        }
        expect(game.state.objects[source.objectId]!.face).toBe(
          transform ? "transformed" : "default",
        );
        expect(game.state.objects[fuel.objectId]!.zone).toBe(
          transform ? "banishment" : "graveyard",
        );
        expect(lv(foe.objectId)).toBe(level - 1);
        expect(lv(own.objectId)).toBe(4);
        advanceToMain(game, p.id);
        p.activate(transform ? fireball : breakApart, {
          reservePayment: pay(transform ? 4 : 3),
          targets: { "target-1": [source.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
        expect(lv(foe.objectId)).toBe(level);
        expect(lv(own.objectId)).toBe(4);
      });
});

/** @covers zfb0pzm6qp-a2 */
describe("Submerged Fatestone transformation gates", () => {
  for (const matching of [false, true])
    for (const fuel of [false, true]) {
      if (matching && fuel) continue;
      it(`Guo Jia=${matching}, floating memory=${fuel}`, () => {
        const champion = enableAllTestElements(
          createLineageTestChampion(submergedFatestone, matching ? "Guo Jia" : "Other"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [submergedFatestone],
              graveyard: [woodlandSquirrels, ...(fuel ? [reclaim] : [])],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] } },
        });
        const p = game.player("player-one");
        advanceToRecollection(game, p.id);
        passEffectsStack(game);
        if (!matching) expect(game.state.decision).toBeNull();
        else if (game.state.decision) {
          answerDecision(game, "resolve-optional-effect", true);
          passEffectsStack(game);
        }
        expect(game.state.objects[p.card(submergedFatestone).objectId]!.face).toBe("default");
        expect(p.zone("banishment")).toHaveLength(0);
        expect(p.zone("graveyard")).toHaveLength(fuel ? 2 : 1);
      });
    }
});
