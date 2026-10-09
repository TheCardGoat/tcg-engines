import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { extinguishingSynchron } from "./extinguishing-synchron.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers Tx8noEw78s-a1 @covers Tx8noEw78s-a2 */
describe("Extinguishing Synchron — earned refinement and recovery", () => {
  for (const count of [0, 1, 3])
    for (const ownSource of [false, true])
      it(`earns ${count} refinement from own fire source=${ownSource}`, () => {
        const champion = enableAllTestElements(lineageTestChampion("Synchron", 0));
        const hand = [
          ...Array.from({ length: count + 2 }, () => sparkAlight),
          ...Array.from({ length: 2 * (count + 2) }, () => woodlandSquirrels),
        ];
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: { champion, zones: { field: [extinguishingSynchron, giantTortoise], hand } },
          playerTwo: { champion, zones: { field: [woodlandSquirrels], hand } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion),
          foe = q.card(champion),
          source = p.card(extinguishingSynchron);
        const refinement = () =>
          game.state.objects[source.objectId]!.counters["named:refinement"] ?? 0;
        q.declareAttack(q.card(woodlandSquirrels, { zone: "field" }), hero);
        game.resolveCombatWithoutRetaliation();
        expect(refinement()).toBe(0);
        const opportunity = (actor: typeof p) => {
          const wait = game.waitState();
          if (wait.kind !== "opportunity") throw new Error(`Unexpected wait ${wait.kind}`);
          if (wait.playerId !== actor.id) game.player(wait.playerId).pass();
        };
        const burn = (actor: typeof p, target: typeof hero) => {
          opportunity(actor);
          actor.activate(actor.cards(sparkAlight, { zone: "hand" })[0]!, {
            targets: { "target-1": [target.objectId] },
            reservePayment: actor
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 2)
              .map((c) => ({ kind: "card", cardId: c.objectId })),
          });
          passEffectsStack(game);
        };
        burn(q, p.card(giantTortoise));
        burn(q, foe);
        expect(refinement()).toBe(0);

        for (let n = 0; n < count; n++) {
          burn(ownSource ? p : q, hero);
          expect(refinement()).toBe(n + 1);
        }
        opportunity(p);
        expect(game.state.objects[hero.objectId]!.damage).toBe(1 + 2 * count);
        const before = game.state;
        expect(() => q.activateAbility(source, "Tx8noEw78s-a2")).toThrow();
        expect(game.state).toEqual(before);
        p.activateAbility(source, "Tx8noEw78s-a2");
        expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
        expect(refinement()).toBe(0);
        expect(game.state.objects[hero.objectId]!.damage).toBe(1 + 2 * count);
        const paid = game.state;
        expect(() => p.activateAbility(source, "Tx8noEw78s-a2")).toThrow();
        expect(game.state).toEqual(paid);
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]!.damage).toBe(
          Math.max(0, 1 + 2 * count - (2 + count)),
        );
        expect(game.state.objects[foe.objectId]!.damage).toBe(2);
        expect(game.state.objects[p.card(giantTortoise).objectId]!.damage).toBe(2);
      });
});
