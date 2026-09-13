import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { silvieWildsWhisperer } from "./silvie-wilds-whisperer.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { grayWolf } from "../allies/gray-wolf.ts";
import { eagerPage } from "../allies/eager-page.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers RfPP8h16Wv-a1 */
describe("Silvie Wilds Whisperer's next Animal or Beast entry", () => {
  for (const ally of [woodlandSquirrels, grayWolf])
    for (const expire of [false, true])
      it(`${ally.slug}, expired=${expire}`, () => {
        const starter = lineageTestChampion("Silvie", 0),
          game = GrandArchiveTestEngine.startFixture({
            phase: "materialize",
            playerOne: {
              champion: starter,
              zones: {
                "material-deck": [silvieWildsWhisperer],
                memory: [woodlandSquirrels],
                hand: [
                  eagerPage,
                  ally,
                  ally,
                  ...Array.from({ length: 10 }, () => woodlandSquirrels),
                ],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion: starter,
              zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] },
            },
          });
        const p = game.player("player-one"),
          q = game.player("player-two");
        p.materialize(silvieWildsWhisperer);
        passEffectsStack(game);
        advanceToMain(game, p.id);
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(-n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        p.activate(eagerPage, { reservePayment: pay(3) });
        passEffectsStack(game);
        expect(game.state.objects[p.card(eagerPage).objectId]!.counters.buff ?? 0).toBe(0);
        if (expire) {
          advanceToMain(game, q.id);
          advanceToMain(game, p.id);
        }
        const first = p.cards(ally, { zone: "hand" })[0]!;
        p.activate(first, ally === grayWolf ? { reservePayment: pay(2) } : {});
        passEffectsStack(game);
        expect(game.state.objects[first.objectId]!.counters.buff ?? 0).toBe(expire ? 0 : 1);
        const second = p.cards(ally, { zone: "hand" })[0]!;
        p.activate(second, ally === grayWolf ? { reservePayment: pay(2) } : {});
        passEffectsStack(game);
        expect(game.state.objects[second.objectId]!.counters.buff ?? 0).toBe(0);
        const entry = game.state.eventHistory.find(
          (e) => e.type === "object-moved" && e.objectId === first.objectId && e.to === "field",
        );
        if (entry?.type !== "object-moved") throw new Error("Missing ally activation entry");
        expect(entry.initialCounters?.buff ?? 0).toBe(expire ? 0 : 1);
        if (ally === woodlandSquirrels) {
          p.declareAttack(first, q.card(starter));
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[q.card(starter).objectId]!.damage).toBe(expire ? 1 : 2);
        }
      });
});
