import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { springleaf } from "../tokens/springleaf.ts";
import { automatonDrone } from "../tokens/automaton-drone.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { proveReservable } from "../../../testing/reservable.ts";
import { fractalOfCreation } from "./fractal-of-creation.ts";

/** @covers x7mnu1xhs5-a1 */
describe("Fractal of Creation — Reservable", () => {
  proveReservable(fractalOfCreation);
});

/** @covers x7mnu1xhs5-a2 */
describe("Fractal of Creation — sacrifice to copy a controlled token", () => {
  for (const token of [springleaf, automatonDrone]) {
    it(`copies ${token.slug} only after paying sacrifice and resolving`, () => {
      const champion = createClassBonusTestChampion(
        fractalOfCreation,
        false,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: { champion, zones: { field: [fractalOfCreation, token, woodlandSquirrels] } },
        playerTwo: { champion, zones: { field: [token] } },
      });
      const player = game.player("player-one");
      const source = player.card(fractalOfCreation, { zone: "field" });
      const target = player.card(token, { zone: "field" });
      for (const invalid of [
        player.card(woodlandSquirrels, { zone: "field" }),
        game.player("player-two").card(token, { zone: "field" }),
      ]) {
        const before = game.state.stateVersion;
        expect(() =>
          player.activateAbility(source, "x7mnu1xhs5-a2", {
            targets: { "copied-object": [invalid.objectId] },
          }),
        ).toThrow();
        expect(game.state.stateVersion).toBe(before);
        expect(game.state.objects[source.objectId]!.zone).toBe("field");
      }
      if (token === automatonDrone) {
        player.declareAttack(target, game.player("player-two").card(champion, { zone: "field" }));
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(true);
      }
      player.activateAbility(source, "x7mnu1xhs5-a2", {
        targets: { "copied-object": [target.objectId] },
      });
      expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
      expect(player.cards(token, { zone: "field" })).toEqual([target]);
      passEffectsStack(game);
      const copies = player.cards(token, { zone: "field" });
      expect(copies).toHaveLength(2);
      expect(copies).toContainEqual(target);
      const copy = copies.find((ref) => ref.objectId !== target.objectId);
      if (!copy) throw new Error("Expected a distinct token copy");
      expect(game.state.objects[copy.objectId]!.isToken).toBe(true);
      expect(game.state.objects[copy.objectId]!.controllerId).toBe(player.id);
      expect(game.state.objects[copy.objectId]!.ownerId).toBe(player.id);
      expect(game.state.objects[copy.objectId]!.states.has("rested")).toBe(false);
      if (token === automatonDrone) {
        expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(true);
        const enemy = game.player("player-two").card(champion, { zone: "field" });
        const beforeDamage = game.state.objects[enemy.objectId]!.damage;
        player.declareAttack(copy, enemy);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[enemy.objectId]!.damage).toBe(beforeDamage + 1);
      }
      expect(game.player("player-two").cards(token, { zone: "field" })).toHaveLength(1);
    });
  }
});
