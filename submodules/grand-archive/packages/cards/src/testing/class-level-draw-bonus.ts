import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { sparkAlight } from "../cards/DOA/actions/spark-alight.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "./class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "./decisions.ts";
export function proveClassLevelDrawBonus(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  threshold: number,
  mode: "capacitance" | "reclaim" | "shunt" | "gusts",
) {
  for (const matching of [false, true]) {
    for (const level of [threshold - 1, threshold, threshold + 1]) {
      for (const combat of mode === "shunt" ? [false, true] : [false]) {
        it(`draw bonus requires both matching class=${matching} and level=${level}, combat=${combat}`, () => {
          const champion = enableAllTestElements(
            grantTestChampionLevel(
              createClassBonusTestChampion(card, matching, "activation-discount"),
              level,
            ),
          );
          const opponent = enableAllTestElements(lineageTestChampion("Opponent", 0));
          const cost = mode === "capacitance" ? 1 : mode === "gusts" && !matching ? 4 : 2;
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: combat ? "playerTwo" : "playerOne",
            playerOne: {
              champion,
              zones: {
                hand: [card, ...Array.from({ length: cost }, () => woodlandSquirrels)],
                field: [giantTortoise],
                "main-deck": [woodlandSquirrels, giantTortoise, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion: opponent,
              zones: {
                field: combat ? [woodlandSquirrels] : [],
                hand: combat ? [sparkAlight, woodlandSquirrels, woodlandSquirrels] : [],
                "main-deck": [woodlandSquirrels, giantTortoise],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const deck = p.zone("main-deck"),
            opponentDeck = q.zone("main-deck"),
            ally = p.card(giantTortoise);
          if (combat) {
            q.declareAttack(q.card(woodlandSquirrels, { zone: "field" }), p.card(champion));
            q.activate(sparkAlight, {
              reservePayment: q
                .cards(woodlandSquirrels, { zone: "hand" })
                .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
              targets: { "target-1": [p.card(champion).objectId] },
            });
            const wait = game.waitState();
            if (wait.kind === "opportunity" && wait.playerId === q.id) q.pass();
          }
          p.activate(card, {
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
            ...(mode === "reclaim"
              ? { targets: { "target-1": [ally.objectId] } }
              : mode === "gusts"
                ? { targets: { "target-1": [q.card(opponent).objectId] } }
                : {}),
          });
          const memory = p.zone("memory");
          expect(p.zone("main-deck")).toEqual(deck);
          passEffectsStack(game);
          if (mode === "capacitance") {
            answerDecision(game, "resolve-effect-choice", []);
            passEffectsStack(game);
          }
          if (combat) {
            expect(game.state.turn.phase).toBe("main");
            expect(q.cards(sparkAlight, { zone: "banishment" })).toHaveLength(1);
            expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(0);
          }
          const draws = matching && level >= threshold;
          expect(p.zone("main-deck")).toEqual(draws ? deck.slice(1) : deck);
          expect(q.zone("main-deck")).toEqual(opponentDeck);
          if (mode === "capacitance") {
            expect(p.zone("memory")).toEqual(memory);
            expect(p.zone("hand")).toEqual(draws ? [deck[0]] : []);
          } else {
            expect(p.zone("memory")).toEqual(draws ? [...memory, deck[0]] : memory);
            expect(p.zone("hand")).toEqual(mode === "reclaim" ? [ally] : []);
          }
        });
      }
    }
  }
}
