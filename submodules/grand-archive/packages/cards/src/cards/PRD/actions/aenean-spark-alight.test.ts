import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { aeneanSparkAlight } from "./aenean-spark-alight.ts";
import { aeneanWard } from "./aenean-ward.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { blitzMage } from "../../DOA/allies/blitz-mage.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers cm1pdhFEz7-a1
 * @covers cm1pdhFEz7-a2
 * @covers cm1pdhFEz7-a3
 */
describe("Aenean Spark Alight", () => {
  for (const matching of [false, true])
    for (const level of [2, 3, 5, 6])
      for (const kind of ["champion", "ally"])
        it(`bypasses a shield without using it, level=${level}, class=${matching}, ${kind}`, () => {
          const champion = createClassBonusTestChampion(aeneanWard, false, "activation-discount");
          const attacker = grantTestChampionLevel(
            createClassBonusTestChampion(aeneanSparkAlight, matching, "activation-discount"),
            level,
          );
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: "playerTwo",
            playerOne: {
              champion,
              zones: { field: [giantTortoise], hand: [aeneanWard, woodlandSquirrels] },
            },
            playerTwo: {
              champion: attacker,
              zones: {
                field: [woodlandSquirrels, blitzMage],
                hand: [aeneanSparkAlight, woodlandSquirrels, woodlandSquirrels],
                "main-deck": [giantTortoise, woodlandSquirrels],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const target = p.card(kind === "ally" ? giantTortoise : champion);
          const drawn = q.zone("main-deck")[0]!;
          q.pass();
          p.activate(aeneanWard, {
            reservePayment: [
              { kind: "card", cardId: p.card(woodlandSquirrels, { zone: "hand" }).objectId },
            ],
            targets: { "target-1": [target.objectId] },
          });
          passEffectsStack(game);
          const wait = game.waitState();
          if (wait.kind === "opportunity" && wait.playerId === p.id) p.pass();
          q.activate(aeneanSparkAlight, {
            reservePayment: q
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
            targets: { "target-1": [target.objectId] },
          });
          passEffectsStack(game);
          const damage = matching && level >= 3 ? 3 : 2;
          expect(game.state.objects[target.objectId]!.damage).toBe(damage);
          expect(q.zone("memory")).toHaveLength(matching && level >= 6 ? 3 : 2);
          expect(q.zone("memory").some((ref) => ref.objectId === drawn.objectId)).toBe(
            matching && level >= 6,
          );
          q.declareAttack(q.card(woodlandSquirrels, { zone: "field" }), target);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[target.objectId]!.damage).toBe(damage);
          q.declareAttack(blitzMage, target);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[target.objectId]!.damage).toBe(damage + 2);
        });
});
