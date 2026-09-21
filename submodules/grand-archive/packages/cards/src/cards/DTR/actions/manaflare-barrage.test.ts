import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { manaflareBarrage } from "./manaflare-barrage.ts";
import { trivariateDream } from "../weapons/trivariate-dream.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { reposition } from "../../ALC/actions/reposition.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { finishOptionalAetherwingLoad } from "../../../testing/optional-aetherwing-load.ts";

/** @covers a8mmiv2ptn-a1 @covers a8mmiv2ptn-a2 @covers a8mmiv2ptn-a3 */
describe("Manaflare Barrage — discounted area damage and optional loading", () => {
  for (const matching of [false, true])
    for (const distance of ["none", "self", "opponent", "response"] as const)
      it(`pays its class cost and excludes only its own champion, class=${matching}, distance=${distance}`, () => {
        const champion = createClassBonusTestChampion(
            manaflareBarrage,
            matching,
            "activation-discount",
          ),
          cost = matching ? 3 : 5;
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [
                trivariateDream,
                trivariateDream,
                trainingSword,
                giantTortoise,
                woodlandSquirrels,
              ],
              hand: [
                manaflareBarrage,
                reposition,
                ...Array.from({ length: cost + 1 }, () => woodlandSquirrels),
              ],
            },
          },
          playerTwo: {
            champion,
            zones: { field: [trivariateDream, giantTortoise, woodlandSquirrels] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(manaflareBarrage),
          host = p.cards(trivariateDream)[1]!;
        const allies = [p.card(giantTortoise), q.card(giantTortoise)],
          small = [p.card(woodlandSquirrels, { zone: "field" }), q.card(woodlandSquirrels)];
        const makeDistant = () =>
          p.activate(reposition, {
            targets: { "target-1": [(distance === "opponent" ? q : p).card(champion).objectId] },
            reservePayment: [
              { kind: "card", cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
            ],
          });
        if (distance === "self" || distance === "opponent") {
          makeDistant();
          passEffectsStack(game);
        }
        const reservePayment = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, cost)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const before = game.state;
        expect(() => p.activate(source, { reservePayment: reservePayment.slice(1) })).toThrow();
        expect(game.state).toEqual(before);
        p.activate(source, { reservePayment });
        for (const ally of allies) expect(game.state.objects[ally.objectId]!.damage).toBe(0);
        if (distance === "response") makeDistant();
        passEffectsStack(game);
        const increased = distance === "self" || distance === "response",
          damage = increased ? 3 : 2;
        for (const ally of allies) expect(game.state.objects[ally.objectId]!.damage).toBe(damage);
        for (const ally of small) expect(game.state.objects[ally.objectId]!.damage).toBe(damage);
        expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(0);
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(damage);
        expect(game.state.objects[host.objectId]!.counters.durability).toBe(3);
        finishOptionalAetherwingLoad(game, source.objectId, host.objectId, increased, [
          q.card(trivariateDream).objectId,
          p.card(trainingSword).objectId,
        ]);
        for (const ally of small) expect(game.state.objects[ally.objectId]!.zone).toBe("graveyard");
        if (increased) {
          p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [host.objectId] });
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(damage + 2);
          expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
        }
      });
});
