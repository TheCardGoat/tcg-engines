import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { rescueTheHeir } from "./rescue-the-heir.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { cordeliaAurousKaiser } from "../../MRC/allies/cordelia-aurous-kaiser.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers t0240ykvj0-a1
 * @covers t0240ykvj0-a2 */
describe("Rescue the Heir", () => {
  for (const level of [0, 1, 2])
    for (const unique of [false, true])
      it(`returns the ally at level=${level}, own unique ally=${unique}`, () => {
        const champion = grantTestChampionLevel(
            createClassBonusTestChampion(rescueTheHeir, false, "activation-discount"),
            level,
          ),
          cost = level >= 1 && unique ? 0 : 1;
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [rescueTheHeir, woodlandSquirrels],
              field: [giantTortoise, ...(unique ? [cordeliaAurousKaiser] : [])],
              graveyard: [cordeliaAurousKaiser],
            },
          },
          playerTwo: { champion, zones: { field: [cordeliaAurousKaiser] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          target = p.card(unique ? cordeliaAurousKaiser : giantTortoise, { zone: "field" });
        const reservePayment = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, cost)
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
        const options = { reservePayment, targets: { "target-1": [target.objectId] } },
          before = game.state;
        if (cost) {
          expect(() => p.activate(rescueTheHeir, { ...options, reservePayment: [] })).toThrow();
          expect(game.state).toEqual(before);
        }
        for (const ref of [q.card(cordeliaAurousKaiser), p.card(champion)]) {
          expect(() =>
            p.activate(rescueTheHeir, { reservePayment, targets: { "target-1": [ref.objectId] } }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        p.activate(rescueTheHeir, options);
        expect(p.zone("memory")).toHaveLength(cost);
        expect(game.state.objects[target.objectId]!.zone).toBe("field");
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.zone).toBe("memory");
        expect(p.zone("memory")).toHaveLength(cost + 1);
        expect(q.cards(cordeliaAurousKaiser, { zone: "field" })).toHaveLength(1);
        expect(p.cards(rescueTheHeir, { zone: "graveyard" })).toHaveLength(1);
      });
});
