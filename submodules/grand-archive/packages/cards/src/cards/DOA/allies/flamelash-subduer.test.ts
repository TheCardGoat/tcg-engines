import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "./woodland-squirrels.ts";
import { giantTortoise } from "./giant-tortoise.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { proveAnimalBeastLevel } from "../../../testing/animal-beast-level.ts";
import { describe } from "vitest";
import { flamelashSubduer } from "./flamelash-subduer.ts";

/** @covers 1i6ierdDjq-a1 */
describe("Flamelash Subduer \u2014 resolution", () => {
  proveAnimalBeastLevel(flamelashSubduer);
});

/** @covers 1i6ierdDjq-a2 */
describe("Flamelash Subduer's ally damage and temporary power", () => {
  for (const classBonus of [false, true])
    for (const ally of [flamelashSubduer, giantTortoise, woodlandSquirrels])
      it(`class=${classBonus}, target=${ally.slug}`, () => {
        const champion = createClassBonusTestChampion(
            flamelashSubduer,
            classBonus,
            "activation-discount",
          ),
          game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [flamelashSubduer, giantTortoise, woodlandSquirrels],
                "main-deck": [woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: { field: [giantTortoise], "main-deck": [woodlandSquirrels] },
            },
          });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(flamelashSubduer),
          target = p.card(ally, { zone: "field" }),
          power = (id: typeof source.objectId) =>
            deriveGrandArchiveNumericProperty(game.state.objects[id]!, "power", {
              program: game.program,
              state: game.state,
              controllerId: p.id,
              bindings: {},
            });
        const before = game.state;
        if (!classBonus) {
          expect(() =>
            p.activateAbility(source, "1i6ierdDjq-a2", {
              targets: { "target-1": [target.objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          return;
        }
        for (const illegal of [q.card(giantTortoise), p.card(champion)]) {
          expect(() =>
            p.activateAbility(source, "1i6ierdDjq-a2", {
              targets: { "target-1": [illegal.objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        p.activateAbility(source, "1i6ierdDjq-a2", { targets: { "target-1": [target.objectId] } });
        expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
        passEffectsStack(game);
        expect(power(source.objectId)).toBe(ally === flamelashSubduer ? 3 : 1);
        if (ally === woodlandSquirrels)
          expect(game.state.objects[target.objectId]!.zone).toBe("graveyard");
        else {
          expect(game.state.objects[target.objectId]!.damage).toBe(2);
          expect(power(target.objectId)).toBe(3);
          if (ally === giantTortoise) {
            p.declareAttack(target, q.card(champion));
            game.resolveCombatWithoutRetaliation();
            expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(3);
          }
        }
        const rested = game.state;
        expect(() =>
          p.activateAbility(source, "1i6ierdDjq-a2", {
            targets: { "target-1": [source.objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(rested);
        advanceToMain(game, q.id);
        expect(power(source.objectId)).toBe(1);
        if (ally !== woodlandSquirrels) expect(power(target.objectId)).toBe(1);
      });
});
