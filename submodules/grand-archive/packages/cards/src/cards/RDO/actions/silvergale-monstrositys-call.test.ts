import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { silvergaleMonstrositysCall } from "./silvergale-monstrositys-call.ts";
import { fracturedMemories } from "../../P25/masteries/fractured-memories.ts";
import { memoriteObelith } from "../../PTM/tokens/memorite-obelith.ts";
import { merlinMemoriteVassal } from "../../PTM/champions/merlin-memorite-vassal.ts";
import { spallingCleanse } from "../../SP4/actions/spalling-cleanse.ts";
import { acceptedContract } from "../../DOA/actions/accepted-contract.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers lsLd8ADGAe-a1
 * @covers lsLd8ADGAe-a2
 */
describe("Silvergale Monstrosity's Call", () => {
  for (const prepared of [false, true])
    for (const moved of [0, 1, 4])
      it(`summons and distributes earned mastery sheen, prepared=${prepared}, move=${moved}`, () => {
        const starter = lineageTestChampion("Merlin", 0),
          merlin = enableAllTestElements(merlinMemoriteVassal);
        const game = GrandArchiveTestEngine.startFixture({
          definitions: [fracturedMemories, memoriteObelith],
          phase: "materialize",
          playerOne: {
            champion: starter,
            zones: {
              "material-deck": [merlin],
              field: [memoriteObelith, giantTortoise],
              memory: [woodlandSquirrels],
              hand: [
                silvergaleMonstrositysCall,
                acceptedContract,
                spallingCleanse,
                spallingCleanse,
                ...Array.from({ length: 12 }, () => woodlandSquirrels),
              ],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: { champion: starter, zones: { field: [memoriteObelith] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        p.materialize(merlin);
        passEffectsStack(game);
        answerDecision(game, "resolve-optional-effect", false);
        passEffectsStack(game);
        advanceToMain(game, p.id);
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
        for (const source of p.cards(spallingCleanse, { zone: "hand" })) {
          p.activate(source, { reservePayment: pay(2) });
          passEffectsStack(game);
        }
        p.activate(acceptedContract, { reservePayment: pay(5) });
        passEffectsStack(game);
        expect(game.state.players[p.id]!.mastery?.counters["named:sheen"]).toBe(4);
        p.activate(silvergaleMonstrositysCall, {
          reservePayment: pay(3),
          ...(prepared ? { prepareAbilityIndexes: [0] as const } : {}),
        });
        expect(game.state.objects[p.card(starter).objectId]!.counters.preparation).toBe(
          prepared ? 1 : 3,
        );
        passEffectsStack(game);
        const tokens = p.cards(memoriteObelith, { zone: "field" });
        expect(tokens).toHaveLength(2);
        if (prepared) {
          const before = game.state;
          expect(() => answerDecision(game, "resolve-effect-choice", 5)).toThrow();
          expect(game.state).toEqual(before);
          answerDecision(game, "resolve-effect-choice", moved);
          passEffectsStack(game);
          const current = game.state;
          for (const invalid of [q.card(memoriteObelith), p.card(giantTortoise)]) {
            expect(() =>
              answerDecision(game, "resolve-effect-choice", [invalid.objectId]),
            ).toThrow();
            expect(game.state).toEqual(current);
          }
          answerDecision(
            game,
            "resolve-effect-choice",
            moved ? tokens.map((ref) => ref.objectId) : [],
          );
          passEffectsStack(game);
          if (moved) {
            const beforeDistribution = game.state;
            expect(() =>
              answerDecision(game, "resolve-distribution", {
                allocations: [{ objectId: q.card(memoriteObelith).objectId, amount: moved }],
              }),
            ).toThrow();
            expect(game.state).toEqual(beforeDistribution);
            answerDecision(game, "resolve-distribution", {
              allocations:
                moved === 1
                  ? [{ objectId: tokens[1]!.objectId, amount: 1 }]
                  : tokens.map((ref) => ({ objectId: ref.objectId, amount: 2 })),
            });
            passEffectsStack(game);
          }
        }
        expect(game.state.decision).toBeNull();
        expect(game.state.players[p.id]!.mastery?.counters["named:sheen"] ?? 0).toBe(
          4 - (prepared ? moved : 0),
        );
        expect(
          tokens.map((ref) => game.state.objects[ref.objectId]!.counters["named:sheen"] ?? 0),
        ).toEqual(!prepared || moved === 0 ? [0, 0] : moved === 1 ? [0, 1] : [2, 2]);
        expect(
          game.state.objects[q.card(memoriteObelith).objectId]!.counters["named:sheen"] ?? 0,
        ).toBe(0);
      });
});
