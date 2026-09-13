import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { grayWolf } from "../cards/DOA/allies/gray-wolf.ts";
import { favorableWinds } from "../cards/DOA/actions/favorable-winds.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack, answerDecision } from "./decisions.ts";

export function proveGlimpsePlay({
  card,
  cost,
  count,
  level = 0,
  classBonus = false,
  classRestricted = false,
  preparation = 0,
  draw,
  windDraw = false,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  cost: { kind: "reserve" | "memory"; amount: number };
  count: number;
  level?: number;
  classBonus?: boolean;
  classRestricted?: boolean;
  preparation?: number;
  draw?: "hand" | "memory";
  windDraw?: boolean;
}): void {
  for (const shortDeck of [false, true])
    for (const bottomAll of [false, true]) {
      it(`glimpses ${count}, short deck=${shortDeck}, bottom=${bottomAll}, class=${classBonus}`, () => {
        const champion = grantTestChampionLevel(
          createClassBonusTestChampion(card, classBonus, "activation-discount"),
          level,
        );
        const payments = Array.from({ length: cost.amount }, () => woodlandSquirrels);
        const game = GrandArchiveTestEngine.startFixture({
          phase: cost.kind === "memory" ? "materialize" : "main",
          playerOne: {
            champion,
            zones: {
              hand: cost.kind === "reserve" ? [card, ...payments] : [],
              memory: cost.kind === "memory" ? payments : [],
              "material-deck": cost.kind === "memory" ? [card] : [],
              "main-deck": shortDeck
                ? [woodlandSquirrels]
                : [woodlandSquirrels, grayWolf, favorableWinds, giantTortoise, woodlandSquirrels],
            },
          },
          playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const deck = p.zone("main-deck");
        if (cost.kind === "memory") p.materialize(card);
        else
          p.activate(card, {
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card", cardId: c.objectId })),
          });
        expect(p.zone("main-deck")).toEqual(deck);
        passEffectsStack(game);
        if (classRestricted && !classBonus) {
          expect(game.state.decision).toBeNull();
          expect(p.zone("main-deck")).toEqual(deck);
          return;
        }
        const looked = deck.slice(0, count).reverse();
        if (count > 0) {
          const decision = game.state.decision;
          if (decision?.kind !== "resolve-glimpse")
            throw new Error(`Expected glimpse, got ${decision?.kind}`);
          expect(decision.cardIds).toEqual(deck.slice(0, count).map((c) => c.objectId));
          const before = game.state;
          expect(() =>
            answerDecision(game, "resolve-glimpse", {
              kind: "reorder",
              top: [...decision.cardIds, decision.cardIds[0]],
              bottom: [],
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          answerDecision(game, "resolve-glimpse", {
            kind: "reorder",
            top: bottomAll ? [] : looked.map((c) => c.objectId),
            bottom: bottomAll ? looked.map((c) => c.objectId) : [],
          });
          passEffectsStack(game);
        }
        const reordered = bottomAll
          ? [...deck.slice(count), ...looked]
          : [...looked, ...deck.slice(count)];
        const draws =
          Boolean(draw) || (windDraw && reordered[0]?.definitionId === favorableWinds.canonicalId);
        if (game.state.decision?.kind === "resolve-optional-effect") {
          answerDecision(game, "resolve-optional-effect", false);
          passEffectsStack(game);
        }
        expect(p.zone("main-deck")).toEqual(reordered.slice(draws ? 1 : 0));
        const destination = draw ?? "hand";
        if (draws) expect(p.zone(destination)).toContainEqual(reordered[0]);
        expect(p.zone("hand")).toHaveLength(draws && destination === "hand" ? 1 : 0);
        expect(game.state.objects[p.card(champion).objectId]!.counters.preparation ?? 0).toBe(
          preparation,
        );
        expect(q.zone("hand")).toHaveLength(0);
      });
    }
}
