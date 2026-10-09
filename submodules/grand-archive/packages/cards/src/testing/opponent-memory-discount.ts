import type { GrandArchiveTargetId } from "@tcg/grand-archive-engine/runtime";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { naturesInsight } from "../cards/AMB/actions/natures-insight.ts";
import { flowerbud } from "../cards/HVN/tokens/flowerbud.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "./decisions.ts";
type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
export function proveOpponentMemoryDiscount(
  card: Card,
  threshold: number,
  cost: number,
  discount: number,
  denial: boolean,
) {
  const cards = (n: number) => Array.from({ length: n }, () => woodlandSquirrels);
  for (const matching of [false, true])
    for (const opposing of [0, threshold - 1, threshold, threshold + 1])
      for (const own of [0, threshold + 1]) {
        it(`class=${matching}, opposing memory=${opposing}, own memory=${own}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(card, matching, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            definitions: [flowerbud],
            playerOne: {
              champion,
              zones: { hand: [card, ...cards(cost + 1)], memory: cards(own) },
            },
            playerTwo: {
              champion,
              zones: {
                memory: cards(opposing),
                hand: cards(threshold + 1),
                graveyard: cards(threshold + 1),
                banishment: cards(threshold + 1),
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(card);
          const expected = matching && opposing >= threshold ? cost - discount : cost;
          const targets: Readonly<Record<string, readonly GrandArchiveTargetId[]>> = denial
            ? { "target-stack-item": [] }
            : { "target-1": [q.card(champion).objectId] };
          const pay = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const before = game.state;
          for (const amount of [expected - 1, expected + 1].filter((n) => n >= 0)) {
            expect(() =>
              p.activate(source, { reservePayment: pay.slice(0, amount), targets }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          p.activate(source, { reservePayment: pay.slice(0, expected), targets });
          expect(p.zone("memory")).toHaveLength(own + expected);
          passEffectsStack(game);
          expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
          expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(denial ? 0 : 4);
          if (denial) expect(q.cards(flowerbud, { zone: "field" })).toHaveLength(2);
        });
      }
  for (const matching of [false, true])
    for (const expired of [false, true]) {
      it(`opponent pays reserve before response; class=${matching}, recollected=${expired}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(card, matching, "activation-discount"),
        );
        const activation = denial ? naturesInsight : giantTortoise;
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          definitions: [flowerbud],
          playerOne: { champion, zones: { hand: [card, ...cards(cost)], "main-deck": cards(8) } },
          playerTwo: {
            champion,
            zones: { hand: [activation, ...cards(threshold)], "main-deck": cards(8) },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const settle = () => {
          passEffectsStack(game);
          if (denial && game.state.decision?.kind === "resolve-effect-choice") {
            answerDecision(game, "resolve-effect-choice", [
              q.cards(woodlandSquirrels, { zone: "memory" })[0]!.objectId,
            ]);
            passEffectsStack(game);
          }
          expect(game.state.decision).toBeNull();
          expect(game.state.stack).toHaveLength(0);
        };
        q.activate(activation, {
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
        });
        expect(q.zone("memory")).toHaveLength(threshold);
        if (expired) {
          settle();
          advanceToMain(game, q.id, game.state.turn.number);
          expect(q.zone("memory")).toHaveLength(0);
        }
        q.pass();
        const expected = matching && !expired ? cost - discount : cost;
        const pay = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const targets: Readonly<Record<string, readonly GrandArchiveTargetId[]>> = denial
          ? { "target-stack-item": [] }
          : { "target-1": [q.card(champion).objectId] };
        const before = game.state;
        if (expected > 0) {
          expect(() =>
            p.activate(card, { reservePayment: pay.slice(0, expected - 1), targets }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        p.activate(card, { reservePayment: pay.slice(0, expected), targets });
        expect(p.zone("memory")).toHaveLength(expected);
        settle();
        expect(p.cards(card, { zone: "graveyard" })).toHaveLength(1);
      });
    }
}
