import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { aqueousEnchanting } from "./aqueous-enchanting.ts";

/** @covers fMv7tIOZwL-a2 */
describe("Aqueous Enchanting — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: aqueousEnchanting });
});

/** @covers fMv7tIOZwL-a1 */
describe("Aqueous Enchanting's chosen team stat", () => {
  for (const mode of ["choice-1", "choice-2"])
    it(`chooses only ${mode} for existing own allies until turn end`, () => {
      const champion = createClassBonusTestChampion(
        aqueousEnchanting,
        false,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [woodlandSquirrels, giantTortoise],
            hand: [aqueousEnchanting, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
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
        squirrel = p.card(woodlandSquirrels, { zone: "field" }),
        tortoise = p.card(giantTortoise);
      const stat = (id: typeof squirrel.objectId, property: "power" | "life") =>
        deriveGrandArchiveNumericProperty(game.state.objects[id]!, property, {
          program: game.program,
          state: game.state,
          controllerId: p.id,
          bindings: {},
        });
      const reservePayment = p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 3)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      for (const modeIds of [[], ["choice-1", "choice-2"]]) {
        const before = game.state;
        expect(() => p.activate(aqueousEnchanting, { reservePayment, modeIds })).toThrow();
        expect(game.state).toEqual(before);
      }
      p.activate(aqueousEnchanting, { reservePayment, modeIds: [mode] });
      passEffectsStack(game);
      expect(stat(squirrel.objectId, "power")).toBe(mode === "choice-1" ? 2 : 1);
      expect(stat(squirrel.objectId, "life")).toBe(mode === "choice-2" ? 2 : 1);
      expect(stat(tortoise.objectId, "power")).toBe(mode === "choice-1" ? 2 : 1);
      expect(stat(tortoise.objectId, "life")).toBe(mode === "choice-2" ? 7 : 6);
      expect(stat(q.card(giantTortoise).objectId, "power")).toBe(1);
      expect(stat(q.card(giantTortoise).objectId, "life")).toBe(6);
      const later = p.card(woodlandSquirrels, { zone: "hand" });
      p.activate(later);
      passEffectsStack(game);
      expect(stat(later.objectId, "power")).toBe(1);
      expect(stat(later.objectId, "life")).toBe(1);
      p.declareAttack(squirrel, q.card(champion));
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(
        mode === "choice-1" ? 2 : 1,
      );
      advanceToMain(game, q.id);
      expect(stat(squirrel.objectId, "power")).toBe(1);
      expect(stat(squirrel.objectId, "life")).toBe(1);
      q.declareAttack(giantTortoise, squirrel);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[squirrel.objectId]!.zone).toBe("graveyard");
    });
});
