import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { fortifyingManashot } from "./fortifying-manashot.ts";
import { trivariateDream } from "../weapons/trivariate-dream.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { finishOptionalAetherwingLoad } from "../../../testing/optional-aetherwing-load.ts";

/** @covers 7uveu3avvg-a1 */
describe("Fortifying Manashot — durability target and independent load choice", () => {
  for (const mode of ["same", "different", "decline"] as const)
    it(`adds permanent durability before loading=${mode}`, () => {
      const champion = createClassBonusTestChampion(
        fortifyingManashot,
        false,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [trivariateDream, trivariateDream, trainingSword, woodlandSquirrels],
            graveyard: [trivariateDream],
            hand: [fortifyingManashot, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: { field: [trivariateDream], "main-deck": [woodlandSquirrels, woodlandSquirrels] },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(fortifyingManashot),
        weapons = p.cards(trivariateDream, { zone: "field" });
      const target = weapons[0]!,
        host = weapons[mode === "different" ? 1 : 0]!;
      const reservePayment = p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      for (const invalid of [
        q.card(trivariateDream),
        p.card(trainingSword),
        p.card(woodlandSquirrels, { zone: "field" }),
        p.card(trivariateDream, { zone: "graveyard" }),
      ]) {
        const before = game.state;
        expect(() =>
          p.activate(source, { targets: { "target-1": [invalid.objectId] }, reservePayment }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }
      p.activate(source, { targets: { "target-1": [target.objectId] }, reservePayment });
      expect(game.state.objects[target.objectId]!.counters.durability).toBe(3);
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]!.counters.durability).toBe(5);
      expect(game.state.objects[weapons[1]!.objectId]!.counters.durability).toBe(3);
      expect(game.state.objects[q.card(trivariateDream).objectId]!.counters.durability).toBe(3);
      finishOptionalAetherwingLoad(game, source.objectId, host.objectId, mode !== "decline", [
        q.card(trivariateDream).objectId,
        p.card(trainingSword).objectId,
      ]);
      if (mode !== "decline") {
        p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [host.objectId] });
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(2);
      }
      advanceToMain(game, q.id);
      advanceToMain(game, p.id);
      expect(game.state.objects[target.objectId]!.counters.durability).toBe(
        mode === "same" ? 4 : 5,
      );
      expect(game.state.objects[weapons[1]!.objectId]!.counters.durability).toBe(
        mode === "different" ? 2 : 3,
      );
    });
});
