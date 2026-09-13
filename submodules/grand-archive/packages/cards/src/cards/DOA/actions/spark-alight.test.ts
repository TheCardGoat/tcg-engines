import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { sparkAlight } from "./spark-alight.ts";
import { waterBarrier } from "./water-barrier.ts";
import { spellshieldArcane } from "./spellshield-arcane.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { proveFixedDamageAction } from "../../../testing/fixed-damage-action.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers L9yBqoOshh-a1 */
describe("Spark Alight's damage and class replacement", () => {
  for (const classBonus of [false, true])
    proveFixedDamageAction({
      card: sparkAlight,
      cost: 2,
      damage: classBonus ? 3 : 2,
      targetKind: "unit",
      classBonus,
    });
  for (const classBonus of [false, true])
    for (const shield of [waterBarrier, spellshieldArcane])
      it(`bypasses ${shield.slug} and consumes its one instance, class=${classBonus}`, () => {
        const champion = createClassBonusTestChampion(
            sparkAlight,
            classBonus,
            "activation-discount",
          ),
          opponent = createClassBonusTestChampion(shield, true, "activation-discount"),
          cost = shield === waterBarrier ? 3 : 2,
          game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [sparkAlight, woodlandSquirrels, woodlandSquirrels],
                field: [woodlandSquirrels],
              },
            },
            playerTwo: {
              champion: opponent,
              zones: { hand: [shield, ...Array.from({ length: cost }, () => woodlandSquirrels)] },
            },
          });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = q.card(opponent);
        p.activate(sparkAlight, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card", cardId: c.objectId })),
          targets: { "target-1": [hero.objectId] },
        });
        p.pass();
        q.activate(shield, {
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]!.damage).toBe(classBonus ? 3 : 2);
        expect(game.state.objects[hero.objectId]!.counters.enlighten ?? 0).toBe(0);
        p.declareAttack(p.card(woodlandSquirrels, { zone: "field" }), hero);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[hero.objectId]!.damage).toBe(classBonus ? 4 : 3);
        expect(game.state.objects[hero.objectId]!.counters.enlighten ?? 0).toBe(0);
      });
});
