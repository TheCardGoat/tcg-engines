import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import {
  startWithShiftingCurrentsNorth,
  changeShiftingCurrents,
  advanceToMain,
} from "./shifting-currents.ts";
import { passEffectsStack } from "./decisions.ts";
type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
export function proveCurrentDirectionStats(card: Card, lifeBonus: boolean) {
  const setup = () =>
    startWithShiftingCurrentsNorth({
      playerOneZones: { field: [card] },
      playerTwoZones: { field: [card, ...Array.from({ length: 4 }, () => woodlandSquirrels)] },
    });
  for (const direction of ["north", "east", "south", "west"] as const)
    it(`only own ${lifeBonus ? "East" : "North"} adds stats: direction=${direction}`, () => {
      const game = setup(),
        p = game.player("player-one"),
        q = game.player("player-two"),
        ally = p.card(card),
        opposing = q.card(card);
      if (direction !== "north") {
        changeShiftingCurrents(game, direction);
        passEffectsStack(game);
      }
      advanceToMain(game, p.id);
      const numeric = (id: typeof ally.objectId, property: "life" | "power") =>
        deriveGrandArchiveNumericProperty(game.state.objects[id]!, property, {
          program: game.program,
          state: game.state,
          controllerId: p.id,
          bindings: {},
        });
      const expectedPower = !lifeBonus && direction === "north" ? 3 : 2;
      const expectedLife = lifeBonus ? (direction === "east" ? 4 : 2) : 1;
      expect(numeric(ally.objectId, "power")).toBe(expectedPower);
      expect(numeric(ally.objectId, "life")).toBe(expectedLife);
      expect(numeric(opposing.objectId, "power")).toBe(2);
      expect(numeric(opposing.objectId, "life")).toBe(lifeBonus ? 2 : 1);
      if (!lifeBonus) {
        const target = q.card(lineageTestChampion("Opponent", 0));
        p.declareAttack(ally, target);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(expectedPower);
      } else {
        advanceToMain(game, q.id);
        for (const [i, attacker] of q
          .cards(woodlandSquirrels, { zone: "field" })
          .slice(0, expectedLife)
          .entries()) {
          q.declareAttack(attacker, ally);
          game.resolveCombatWithoutRetaliation();
          expect(p.cards(card, { zone: "field" })).toHaveLength(i + 1 < expectedLife ? 1 : 0);
        }
        expect(p.cards(card, { zone: "graveyard" })).toHaveLength(1);
      }
    });
  it("updates the same ally through a full direction cycle", () => {
    const game = setup(),
      p = game.player("player-one"),
      q = game.player("player-two"),
      ally = p.card(card);
    for (const direction of ["east", "south", "west", "north"] as const) {
      changeShiftingCurrents(game, direction);
      passEffectsStack(game);
      expect(game.state.players[p.id]!.states["shifting-currents"]).toBe(direction);
      expect(game.state.players[q.id]!.states["shifting-currents"]).toBeUndefined();
      const context = {
        program: game.program,
        state: game.state,
        controllerId: p.id,
        bindings: {},
      };
      expect(
        deriveGrandArchiveNumericProperty(
          game.state.objects[ally.objectId]!,
          lifeBonus ? "life" : "power",
          context,
        ),
      ).toBe(lifeBonus ? (direction === "east" ? 4 : 2) : direction === "north" ? 3 : 2);
      advanceToMain(game, p.id);
    }
  });
}
