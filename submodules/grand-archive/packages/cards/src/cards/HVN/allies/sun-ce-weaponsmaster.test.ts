import { describe } from "vitest";
import { sunCeWeaponsmaster } from "./sun-ce-weaponsmaster.ts";
import { proveClassBonusGroupStats } from "../../../testing/class-bonus-group-stats.ts";
/** @covers lvxsgng1a1-a2 */
describe("sunCeWeaponsmaster — continuous group bonus", () => {
  proveClassBonusGroupStats(sunCeWeaponsmaster, "weapon");
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { curvedDagger } from "../../DOA/weapons/curved-dagger.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack, answerDecision } from "../../../testing/decisions.ts";
/** @covers lvxsgng1a1-a1 */
describe("Sun Ce — entry durability", () => {
  for (const matching of [false, true])
    for (const weapon of [false, true])
      it(`requires a matching class and an own Warrior weapon: class=${matching}, weapon=${weapon}`, () => {
        const champion = createClassBonusTestChampion(
          sunCeWeaponsmaster,
          matching,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [curvedDagger, ...(weapon ? [trainingSword] : [])],
              hand: [sunCeWeaponsmaster, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              banishment: [trainingSword],
            },
          },
          playerTwo: { champion, zones: { field: [trainingSword] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        p.activate(sunCeWeaponsmaster, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
        expect(p.cards(sunCeWeaponsmaster, { zone: "field" })).toHaveLength(1);
        if (matching && weapon) {
          expect(game.state.decision?.kind).toBe("announce-triggered-ability");
          const target = p.card(trainingSword, { zone: "field" });
          expect(game.state.objects[target.objectId]!.counters.durability).toBe(2);
          for (const wrong of [
            p.card(curvedDagger),
            q.card(trainingSword),
            p.card(trainingSword, { zone: "banishment" }),
            p.card(sunCeWeaponsmaster),
          ]) {
            const before = game.state;
            expect(() =>
              answerDecision(game, "announce-triggered-ability", {
                targets: { "target-1": [wrong.objectId] },
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          answerDecision(game, "announce-triggered-ability", {
            targets: { "target-1": [target.objectId] },
          });
          expect(game.state.objects[target.objectId]!.counters.durability).toBe(2);
          passEffectsStack(game);
          expect(game.state.objects[target.objectId]!.counters.durability).toBe(3);
          p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [target.objectId] });
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[target.objectId]!.counters.durability).toBe(2);
          expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(2);
        } else if (weapon) {
          expect(
            game.state.objects[p.card(trainingSword, { zone: "field" }).objectId]!.counters
              .durability,
          ).toBe(2);
        }
        expect(game.state.decision).toBeNull();
        expect(game.state.objects[q.card(trainingSword).objectId]!.counters.durability).toBe(2);
        expect(game.state.objects[p.card(curvedDagger).objectId]!.counters.durability).toBe(1);
      });
});
