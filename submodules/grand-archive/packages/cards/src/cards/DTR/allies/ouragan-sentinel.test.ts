import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { vacuousServant } from "../tokens/vacuous-servant.ts";
import { ouraganSentinel } from "./ouragan-sentinel.ts";
import { createLineageTestChampion } from "../../../testing/champion-lineage.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 2zs1pana81-a1 */
describe("Ouragan Sentinel — Ciel Bonus token on each entry", () => {
  for (const ciel of [false, true])
    it(`summons only for its controller's Ciel champion, Ciel=${ciel}`, () => {
      const champion = enableAllTestElements(
        createLineageTestChampion(ouraganSentinel, ciel ? "Ciel" : "Other"),
      );
      const opponent = enableAllTestElements(createLineageTestChampion(ouraganSentinel, "Ciel"));
      const game = GrandArchiveTestEngine.startFixture({
        definitions: [vacuousServant],
        playerOne: {
          champion,
          zones: {
            hand: [
              ouraganSentinel,
              ouraganSentinel,
              ...Array.from({ length: 8 }, () => woodlandSquirrels),
            ],
          },
        },
        playerTwo: { champion: opponent, zones: { field: [ouraganSentinel] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const tokens: string[] = [];
      for (const [index, sentinel] of p.cards(ouraganSentinel).entries()) {
        const beforeIds = new Set(p.zone("field").map((c) => c.objectId));
        p.activate(sentinel, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 4)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        p.pass();
        q.pass();
        expect(game.state.objects[sentinel.objectId]!.zone).toBe("field");
        expect(p.zone("field")).toHaveLength(2 + index + tokens.length);
        passEffectsStack(game);
        const summoned = p
          .zone("field")
          .filter((c) => !beforeIds.has(c.objectId) && c.objectId !== sentinel.objectId);
        expect(summoned).toHaveLength(ciel ? 1 : 0);
        expect(q.zone("field")).toHaveLength(2);
        if (ciel) {
          const token = summoned[0]!;
          tokens.push(token.objectId);
          expect(game.state.objects[token.objectId]!.definitionId).toBe(vacuousServant.canonicalId);
          expect(game.state.objects[token.objectId]!.controllerId).toBe(p.id);
          expect(game.state.objects[token.objectId]!.states.has("rested")).toBe(false);
          p.declareAttack(token, q.card(opponent));
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[q.card(opponent).objectId]!.damage).toBe(index + 1);
        }
      }
    });
});
