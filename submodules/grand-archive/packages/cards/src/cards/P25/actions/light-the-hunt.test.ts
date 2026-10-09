import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { lightTheHunt } from "./light-the-hunt.ts";
import { naturesInsight } from "../../AMB/actions/natures-insight.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { blueSlime } from "../../DOA/allies/blue-slime.ts";
import { weissKnight } from "../../PTM/allies/weiss-knight.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers edjgscy50x-a2 */
describe("Light the Hunt — memory reveal bonuses", () => {
  for (const matchingClass of [false, true])
    for (const matchingElement of [false, true])
      for (const ally of [giantTortoise, blueSlime]) {
        it(`class=${matchingClass}, element=${matchingElement}, recipient=${ally.slug}`, () => {
          const base = createClassBonusTestChampion(
            lightTheHunt,
            matchingClass,
            "activation-discount",
          );
          const champion = enableAllTestElements({
            ...base,
            layout: {
              kind: "single-faced",
              face: {
                ...requireSingleFace(base),
                elements: matchingElement ? ["LUXEM"] : ["NORM"],
              },
            },
          });
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [giantTortoise, blueSlime, weissKnight],
                memory: [lightTheHunt],
                hand: [naturesInsight, ...Array.from({ length: 5 }, () => woodlandSquirrels)],
                "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [giantTortoise],
                memory: [lightTheHunt],
                "main-deck": [woodlandSquirrels],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            revealed = p.card(lightTheHunt),
            target = p.card(ally);
          p.activate(naturesInsight, {
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          });
          passEffectsStack(game);
          answerDecision(game, "resolve-effect-choice", [revealed.objectId]);
          passEffectsStack(game);
          if (
            game.state.decision?.kind === "resolve-effect-choice" &&
            game.state.decision.selection.id === "deck-cards"
          ) {
            answerDecision(
              game,
              "resolve-effect-choice",
              p
                .zone("main-deck")
                .slice(0, 2)
                .map((c) => c.objectId),
            );
            passEffectsStack(game);
          }
          expect(game.state.objects[revealed.objectId]!.zone).toBe("material-deck");
          expect(game.state.objects[revealed.objectId]!.states.has("preserved")).toBe(true);
          if (matchingClass && matchingElement) {
            expect(game.state.decision?.kind).toBe("resolve-effect-choice");
            const pending = game.state;
            for (const ids of [
              [],
              [p.card(weissKnight).objectId],
              [q.card(giantTortoise).objectId],
              [p.card(champion).objectId],
            ]) {
              expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
              expect(game.state).toEqual(pending);
            }
            answerDecision(game, "resolve-effect-choice", [target.objectId]);
            passEffectsStack(game);
          }
          expect(game.state.decision).toBeNull();
          expect(game.state.stack).toHaveLength(0);
          for (const card of [giantTortoise, blueSlime])
            expect(game.state.objects[p.card(card).objectId]!.counters.buff ?? 0).toBe(
              matchingClass && matchingElement && card === ally ? 1 : 0,
            );
          expect(game.state.objects[q.card(giantTortoise).objectId]!.counters.buff ?? 0).toBe(0);
          expect(game.state.objects[q.card(lightTheHunt).objectId]!.zone).toBe("memory");
        });
      }
});

/** @covers edjgscy50x-a1 */
describe("Light the Hunt — two counters on a controlled Animal or Beast", () => {
  for (const matching of [false, true])
    for (const ally of [giantTortoise, blueSlime]) {
      it(`does not require its reveal bonuses: class=${matching}, recipient=${ally.slug}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(lightTheHunt, matching, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [giantTortoise, blueSlime, weissKnight],
              hand: [lightTheHunt, woodlandSquirrels, woodlandSquirrels],
              "main-deck": [woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: { field: [giantTortoise], "main-deck": [woodlandSquirrels] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          target = p.card(ally);
        const reservePayment = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const before = game.state;
        for (const ids of [
          [],
          [p.card(weissKnight).objectId],
          [q.card(giantTortoise).objectId],
          [p.card(champion).objectId],
        ]) {
          expect(() =>
            p.activate(lightTheHunt, { reservePayment, targets: { "target-1": ids } }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        p.activate(lightTheHunt, { reservePayment, targets: { "target-1": [target.objectId] } });
        expect(game.state.objects[target.objectId]!.counters.buff ?? 0).toBe(0);
        passEffectsStack(game);
        for (const card of [giantTortoise, blueSlime])
          expect(game.state.objects[p.card(card).objectId]!.counters.buff ?? 0).toBe(
            card === ally ? 2 : 0,
          );
        expect(game.state.objects[q.card(giantTortoise).objectId]!.counters.buff ?? 0).toBe(0);
        expect(game.state.stack).toHaveLength(0);
      });
    }
});
