import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { blightsRing } from "./blights-ring.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { penumbralWaltz } from "../../MRC/actions/penumbral-waltz.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers u8LjHnH6iC-a1 @covers u8LjHnH6iC-a2 */
describe("Blight's Ring lineage controller and unpreventable damage", () => {
  for (const own of [false, true])
    for (const prevent of [false, true])
      it(`follows its host's recollection, own=${own}, prevention=${prevent}`, () => {
        const champion = enableAllTestElements(lineageTestChampion("Ring", 0));
        const hand = () => [
          penumbralWaltz,
          ...Array.from({ length: 4 }, () => fireball),
          ...Array.from({ length: 22 }, () => woodlandSquirrels),
        ];
        const deck = () => Array.from({ length: 8 }, () => woodlandSquirrels);
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: { field: [blightsRing, blightsRing], hand: hand(), "main-deck": deck() },
          },
          playerTwo: { champion, zones: { hand: hand(), "main-deck": deck() } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          host = own ? p : q,
          other = own ? q : p;
        const hero = host.card(champion),
          unaffected = other.card(champion),
          source = p.cards(blightsRing, { zone: "field" })[0]!;
        const pay = (player: typeof p, n: number) =>
          player
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const top = p.zone("main-deck")[0]!;
        const before = game.state;
        expect(() =>
          p.activateAbility(source, "u8LjHnH6iC-a1", {
            reservePayment: pay(p, 3),
            targets: { "target-champion": [hero.objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        for (const targets of [[], [source.objectId], [hero.objectId, hero.objectId]]) {
          expect(() =>
            p.activateAbility(source, "u8LjHnH6iC-a1", {
              reservePayment: pay(p, 4),
              targets: { "target-champion": targets },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        expect(() =>
          p.activateAbility(source, "u8LjHnH6iC-a1", {
            reservePayment: pay(p, 5),
            targets: { "target-champion": [hero.objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activateAbility(source, "u8LjHnH6iC-a1", {
          reservePayment: pay(p, 4),
          targets: { "target-champion": [hero.objectId] },
        });
        expect(game.state.objects[source.objectId]!.zone).toBe("field");
        const pending = game.state;
        expect(() =>
          p.activateAbility(source, "u8LjHnH6iC-a1", {
            reservePayment: pay(p, 4),
            targets: { "target-champion": [hero.objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(pending);
        passEffectsStack(game);
        expect(p.zone("memory")).toContainEqual(top);
        expect(game.state.objects[source.objectId]!.zone).toBe("inner-lineage");
        expect(game.state.objects[source.objectId]!.hostId).toBe(hero.objectId);
        if (own) {
          advanceToRecollection(game, q.id);
          expect(game.state.stack).toHaveLength(0);
        }
        advanceToRecollection(game, host.id);
        expect(game.state.objects[hero.objectId]!.damage).toBe(0);
        expect(game.state.stack).toHaveLength(1);
        if (prevent) host.activate(penumbralWaltz, { variables: { X: 0 } });
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]!.damage).toBe(1);
        expect(game.state.objects[unaffected.objectId]!.damage).toBe(0);
        if (prevent) {
          advanceToMain(game, host.id);
          const spells = host.cards(fireball, { zone: "hand" });
          for (let i = 0; i < 4; i++) {
            host.activate(spells[i]!, {
              reservePayment: pay(host, 4),
              targets: { "target-1": [hero.objectId] },
            });
            passEffectsStack(game);
            expect(game.state.objects[hero.objectId]!.damage).toBe(i < 3 ? 1 : 2);
          }
        }
        const current = game.state.objects[hero.objectId]!.damage;
        advanceToRecollection(game, other.id);
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]!.damage).toBe(current);
        expect(game.state.objects[unaffected.objectId]!.damage).toBe(0);
        advanceToRecollection(game, host.id);
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]!.damage).toBe(current + 1);
      });
});
