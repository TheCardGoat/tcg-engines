import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { mementoPocketwatch } from "./memento-pocketwatch.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { createLineageTestChampion } from "../../../testing/champion-lineage.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers f0jbv5n196-a1 @covers f0jbv5n196-a2 */
describe("Memento Pocketwatch — Alice and Ciel memory discounts", () => {
  for (const name of ["Alice", "Ciel", "Other"])
    for (const memory of [0, 1])
      it(`${name} with ${memory} memory`, () => {
        const champion = createLineageTestChampion(mementoPocketwatch, name);
        const game = GrandArchiveTestEngine.startFixture({
          phase: "materialize",
          playerOne: {
            champion,
            zones: {
              "material-deck": [mementoPocketwatch],
              memory: Array.from({ length: memory }, () => woodlandSquirrels),
            },
          },
          playerTwo: { champion: createLineageTestChampion(mementoPocketwatch, "Alice") },
        });
        const p = game.player("player-one"),
          source = p.card(mementoPocketwatch);
        if (name === "Other" && memory === 0) {
          const before = game.state;
          expect(() => p.materialize(source)).toThrow();
          expect(game.state).toEqual(before);
          return;
        }
        p.materialize(source);
        expect(p.zone("memory")).toHaveLength(memory - (name === "Other" ? 1 : 0));
        expect(p.zone("banishment")).toHaveLength(name === "Other" ? 1 : 0);
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.zone).toBe("field");
      });
});

/** @covers f0jbv5n196-a3 */
describe("Memento Pocketwatch — charge three, draw, and next attack", () => {
  for (const mode of ["ally", "champion", "expiry"] as const)
    it(`gives the next ${mode} attack a one-attack bonus after its third recollection`, () => {
      const champion = createLineageTestChampion(mementoPocketwatch, "Other");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [mementoPocketwatch, trainingSword, woodlandSquirrels, woodlandSquirrels],
            "main-deck": Array.from({ length: 10 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [woodlandSquirrels],
            "main-deck": Array.from({ length: 10 }, () => woodlandSquirrels),
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(mementoPocketwatch),
        hero = p.card(champion),
        enemy = q.card(champion);
      const allies = p.cards(woodlandSquirrels, { zone: "field" });
      for (let charge = 1; charge <= 3; charge++) {
        advanceToMain(game, q.id);
        expect(game.state.objects[source.objectId]!.counters["named:charge"] ?? 0).toBe(charge - 1);
        const deck = p.zone("main-deck"),
          hand = p.zone("hand").length;
        advanceToMain(game, p.id);
        expect(p.zone("main-deck")).toEqual(deck.slice(charge === 3 ? 2 : 1));
        expect(p.zone("hand")).toHaveLength(hand + (charge === 3 ? 2 : 1));
        expect(game.state.objects[source.objectId]!.zone).toBe(
          charge === 3 ? "banishment" : "field",
        );
      }
      if (mode === "expiry") {
        advanceToMain(game, q.id);
        q.declareAttack(q.card(woodlandSquirrels, { zone: "field" }), hero);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[hero.objectId]!.damage).toBe(1);
        advanceToMain(game, p.id);
      }
      const attacker = mode === "champion" ? hero : allies[0]!;
      const options = mode === "champion" ? { weaponIds: [p.card(trainingSword).objectId] } : {};
      p.declareAttack(attacker, enemy, options);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[enemy.objectId]!.damage).toBe(mode === "expiry" ? 1 : 4);
      p.declareAttack(allies[1]!, enemy);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[enemy.objectId]!.damage).toBe(mode === "expiry" ? 2 : 5);
      advanceToMain(game, q.id);
      const deck = p.zone("main-deck");
      advanceToMain(game, p.id);
      expect(p.zone("main-deck")).toEqual(deck.slice(1));
      p.declareAttack(attacker, enemy, options);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[enemy.objectId]!.damage).toBe(mode === "expiry" ? 3 : 6);
    });
});
