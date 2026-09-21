import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { mireReparation } from "./mire-reparation.ts";
import { condemnedTrinket } from "../items/condemned-trinket.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 7imoz7vrlr-a2 */
describe("Mire Reparation — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: mireReparation });
});

/** @covers 7imoz7vrlr-a1 */
describe("Mire Reparation — own omens recover only its controller", () => {
  for (const count of [0, 1, 2, 3])
    for (const matching of [false, true])
      it(`recovers with ${count} omens, class=${matching}, capped by existing damage`, () => {
        const champion = grantTestChampionLevel(
          enableAllTestElements(
            createClassBonusTestChampion(mireReparation, matching, "activation-discount"),
          ),
          1,
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: Array.from({ length: count }, () => condemnedTrinket),
              graveyard: Array.from({ length: count + 1 }, () => woodlandSquirrels),
              banishment: [woodlandSquirrels],
              hand: [
                mireReparation,
                fireball,
                fireball,
                ...Array.from({ length: 3 * count + 11 }, () => woodlandSquirrels),
              ],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [condemnedTrinket],
              graveyard: [woodlandSquirrels, woodlandSquirrels],
              hand: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        q.activateAbility(q.card(condemnedTrinket), "21oy1nd4nw-a1", {
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
        answerDecision(game, "resolve-effect-choice", [
          q.cards(woodlandSquirrels, { zone: "graveyard" })[0]!.objectId,
        ]);
        passEffectsStack(game);
        advanceToMain(game, p.id);
        const payment = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        for (const trinket of p.cards(condemnedTrinket, { zone: "field" })) {
          p.activateAbility(trinket, "21oy1nd4nw-a1", { reservePayment: payment(3) });
          passEffectsStack(game);
          answerDecision(game, "resolve-effect-choice", [
            p.cards(woodlandSquirrels, { zone: "graveyard" })[0]!.objectId,
          ]);
          passEffectsStack(game);
        }
        for (const owner of [p, q]) {
          p.activate(p.cards(fireball, { zone: "hand" })[0]!, {
            targets: { "target-1": [owner.card(champion).objectId] },
            reservePayment: payment(4),
          });
          passEffectsStack(game);
          expect(game.state.objects[owner.card(champion).objectId]!.damage).toBe(2);
        }
        const before = game.state;
        expect(() => p.activate(mireReparation, { reservePayment: payment(2) })).toThrow();
        expect(game.state).toEqual(before);
        p.activate(mireReparation, { reservePayment: payment(3) });
        expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(2);
        passEffectsStack(game);
        expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(Math.max(0, 2 - count));
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(2);
        expect(
          p.zone("banishment").filter((c) => game.state.objects[c.objectId]!.counters.omen === 1),
        ).toHaveLength(count);
      });
});
