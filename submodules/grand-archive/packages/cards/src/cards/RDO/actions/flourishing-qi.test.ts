import { describe, expect, it } from "vitest";
import { flourishingQi } from "./flourishing-qi.ts";
import { usurpTheWinds } from "../../HVN/actions/usurp-the-winds.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { startWithShiftingCurrentsNorth } from "../../../testing/shifting-currents.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers MDu0e3tib8-a1 */
/** @covers MDu0e3tib8-a2 */
describe("Flourishing Qi charges only its live activation on each change to North", () => {
  for (const level of [0, 2, 3])
    for (const cycles of [0, 1, 2])
      for (const targetAlly of [false, true])
        it(`level=${level}, north changes=${cycles}, ally target=${targetAlly}`, () => {
          const game = startWithShiftingCurrentsNorth({
            extraChampionLevel: level,
            playerOneZones: {
              hand: [
                flourishingQi,
                flourishingQi,
                ...Array.from({ length: 2 + cycles * 2 }, () => usurpTheWinds),
                ...Array.from({ length: 12 }, () => woodlandSquirrels),
              ],
              graveyard: [flourishingQi],
            },
            playerTwoZones: { field: [giantTortoise], hand: [flourishingQi] },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const [source, unused] = p.cards(flourishingQi, { zone: "hand" });
          if (!source || !unused) throw new Error("Missing spell copies");
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const charge = () => game.state.objects[source.objectId]!.counters["named:charge"] ?? 0;
          const shift = (direction: "east" | "north", pending: boolean) => {
            p.activate(p.cards(usurpTheWinds, { zone: "hand" })[0]!, {
              reservePayment: pay(1),
              targets: { "target-1": [] },
            });
            passEffectsStack(game);
            answerDecision(game, "resolve-optional-effect", true);
            passEffectsStack(game);
            answerDecision(game, "resolve-direction-choice", direction);
            if (pending) {
              for (let i = 0; i < 16 && game.state.stack.length > 1; i++) {
                const wait = game.waitState();
                if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
                game.player(wait.playerId).pass();
              }
              expect(game.state.stack).toHaveLength(1);
            } else passEffectsStack(game);
            expect(game.state.players[p.id]!.states["shifting-currents"]).toBe(direction);
          };
          shift("east", false);
          shift("north", false);
          expect(charge()).toBe(0);
          const target = targetAlly
            ? q.card(giantTortoise)
            : q.card(lineageTestChampion("Opponent", 0));
          p.activate(source, {
            reservePayment: pay(4),
            targets: { "target-1": [target.objectId] },
          });
          expect(charge()).toBe(0);
          for (let i = 0; i < cycles; i++) {
            shift("east", true);
            expect(charge()).toBe(i * 4);
            shift("north", true);
            expect(charge()).toBe((i + 1) * 4);
          }
          for (const copy of [
            unused,
            p.card(flourishingQi, { zone: "graveyard" }),
            q.card(flourishingQi),
          ])
            expect(game.state.objects[copy.objectId]!.counters["named:charge"] ?? 0).toBe(0);
          expect(game.state.objects[target.objectId]!.damage).toBe(0);
          passEffectsStack(game);
          const damage = level + 4 * cycles;
          expect(game.state.objects[target.objectId]!.zone).toBe(
            targetAlly && damage >= 6 ? "graveyard" : "field",
          );
          expect(game.state.objects[target.objectId]!.damage).toBe(
            targetAlly && damage >= 6 ? 0 : damage,
          );
          expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
          expect(charge()).toBe(0);
        });
});
