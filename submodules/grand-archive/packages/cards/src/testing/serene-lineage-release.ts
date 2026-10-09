import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  evaluateGrandArchiveAmount,
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "@tcg/grand-archive-engine/runtime";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import { grandArchiveTestFace } from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";
export function proveSereneLineageRelease(
  spirit: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  probe: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
) {
  for (const damage of [0, 3, 7, 10])
    it(`releases the original Spirit after level-up and recovers from ${damage} damage`, () => {
      const successor = lineageTestChampion("Successor", 1);
      const cost = grandArchiveTestFace(probe).cost;
      if (cost.kind !== "reserve" || typeof cost.amount !== "number")
        throw new Error("Expected fixed cost");
      const reserveCost = cost.amount;
      const game = GrandArchiveTestEngine.startFixture({
        phase: "materialize",
        playerOne: {
          champion: spirit,
          zones: {
            "material-deck": [successor],
            memory: [woodlandSquirrels],
            hand: [probe, probe, ...Array.from({ length: 12 }, () => woodlandSquirrels)],
            "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion: lineageTestChampion("Opponent", 0),
          zones: {
            field: Array.from({ length: damage }, () => woodlandSquirrels),
            "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        hero = p.card(spirit),
        abilityId = `${spirit.canonicalId}-a2`;
      p.materialize(successor);
      passEffectsStack(game);
      advanceToMain(game, p.id);
      const pay = () =>
        p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, reserveCost)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      p.activate(p.cards(probe, { zone: "hand" })[0]!, { reservePayment: pay() });
      passEffectsStack(game);
      advanceToMain(game, q.id);
      for (const squirrel of q.cards(woodlandSquirrels, { zone: "field" })) {
        q.declareAttack(squirrel, hero);
        game.resolveCombatWithoutRetaliation();
      }
      const unauthorized = game.state;
      expect(() => q.activateAbility(hero, abilityId)).toThrow();
      expect(game.state).toEqual(unauthorized);
      advanceToMain(game, p.id);
      const lineageCount = () =>
        evaluateGrandArchiveAmount(
          {
            kind: "count",
            collection: {
              zones: ["inner-lineage"],
              host: { kind: "champion", player: "controller" },
              relationship: "lineage-of",
            },
          },
          { program: game.program, state: game.state, controllerId: p.id, bindings: {} },
        );
      expect(lineageCount()).toBe(2);
      expect(
        game
          .legalCommands(p.id)
          .some(
            (c) =>
              c.command.move === "activate-ability" &&
              c.command.sourceId === hero.objectId &&
              c.command.abilityId === abilityId,
          ),
      ).toBe(true);
      p.activateAbility(hero, abilityId);
      expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
      expect(p.cards(spirit, { zone: "banishment" })).toHaveLength(1);
      expect(lineageCount()).toBe(1);
      passEffectsStack(game);
      expect(game.state.objects[hero.objectId]!.damage).toBe(Math.max(0, damage - 6));
      expect(game.state.objects[hero.objectId]!.zone).toBe("field");
      expect(game.state.objects[hero.objectId]!.activeDefinitionId).toBe(successor.canonicalId);
      const before = game.state;
      expect(() => p.activateAbility(hero, abilityId)).toThrow();
      expect(game.state).toEqual(before);
      expect(() =>
        p.activate(p.card(probe, { zone: "hand" }), { reservePayment: pay() }),
      ).toThrow();
      expect(game.state).toEqual(before);
      expect(
        restoreGrandArchiveMatchSnapshot(
          game.program,
          serializeGrandArchiveMatchSnapshot(game.state),
        ),
      ).toEqual(game.state);
    });
}
