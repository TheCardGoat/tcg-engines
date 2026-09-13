import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "./woodland-squirrels.ts";
import { grayWolf } from "./gray-wolf.ts";
import { blitzMage } from "./blitz-mage.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack, answerDecision, advanceToMain } from "../../../testing/decisions.ts";
import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { youngBeastbonder } from "./young-beastbonder.ts";

/** @covers NwswAHojeq-a2 */
describe("Young Beastbonder — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: youngBeastbonder });
});

/** @covers NwswAHojeq-a1 */
describe("Young Beastbonder's other-ally buff", () => {
  for (const classBonus of [false, true])
    for (const ally of [woodlandSquirrels, grayWolf, blitzMage])
      it(`${ally.slug}, class=${classBonus}`, () => {
        const champion = grantTestChampionLevel(
          createClassBonusTestChampion(youngBeastbonder, classBonus, "activation-discount"),
          2,
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [youngBeastbonder, woodlandSquirrels, woodlandSquirrels],
              field: [ally],
              "main-deck": [woodlandSquirrels],
            },
          },
          playerTwo: { champion, zones: { field: [ally], "main-deck": [woodlandSquirrels] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          target = p.card(ally, { zone: "field" });
        p.activate(youngBeastbonder, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
        if (classBonus) {
          const before = game.state;
          for (const id of [
            p.card(youngBeastbonder).objectId,
            q.card(ally).objectId,
            p.card(champion).objectId,
          ]) {
            expect(() =>
              answerDecision(game, "announce-triggered-ability", { targets: { "target-1": [id] } }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          answerDecision(game, "announce-triggered-ability", {
            targets: { "target-1": [target.objectId] },
          });
          expect(game.state.objects[target.objectId]!.counters.buff ?? 0).toBe(0);
          passEffectsStack(game);
        }
        const buff = classBonus ? (ally === grayWolf ? 2 : 1) : 0;
        expect(game.state.objects[target.objectId]!.counters.buff ?? 0).toBe(buff);
        expect(game.state.objects[q.card(ally).objectId]!.counters.buff ?? 0).toBe(0);
        p.declareAttack(target, q.card(champion));
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(
          (ally === grayWolf ? 2 : ally === blitzMage ? 3 : 1) + buff,
        );
        advanceToMain(game, q.id);
        expect(game.state.objects[target.objectId]!.counters.buff ?? 0).toBe(buff);
      });
});
