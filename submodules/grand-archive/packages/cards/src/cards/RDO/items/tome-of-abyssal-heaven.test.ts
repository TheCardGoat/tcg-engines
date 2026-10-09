import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { tomeOfAbyssalHeaven } from "./tome-of-abyssal-heaven.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";

/** @covers igmC01eEZn-a1 */
describe("Tome of Abyssal Heaven — page counters at entry", () => {
  for (const damage of [0, 1, 8, 10])
    it(`uses ${damage} current champion damage, including damage dealt after announcement`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(tomeOfAbyssalHeaven, true, "activation-discount"),
      );
      const opponent = enableAllTestElements(
        grantTestChampionLevel(
          createClassBonusTestChampion(fireball, true, "activation-discount"),
          Math.max(0, damage - 1),
        ),
      );
      const game = GrandArchiveTestEngine.startFixture({
        phase: "materialize",
        playerOne: {
          champion,
          zones: {
            "material-deck": [tomeOfAbyssalHeaven],
            memory: [woodlandSquirrels],
            "main-deck": [woodlandSquirrels],
          },
        },
        playerTwo: {
          champion: opponent,
          zones: { hand: [fireball, woodlandSquirrels, woodlandSquirrels] },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const tome = p.card(tomeOfAbyssalHeaven),
        hero = p.card(champion);
      p.materialize(tome);
      expect(game.state.objects[hero.objectId]!.damage).toBe(0);
      expect(game.state.objects[tome.objectId]!.counters["named:page"] ?? 0).toBe(0);
      if (damage) {
        p.pass();
        q.activate(fireball, {
          targets: { "target-1": [hero.objectId] },
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
      }
      for (let step = 0; step < 12 && game.state.objects[tome.objectId]!.zone !== "field"; step++) {
        const wait = game.waitState();
        if (wait.kind !== "opportunity") throw new Error(`Unexpected wait ${wait.kind}`);
        game.player(wait.playerId).pass();
      }
      expect(game.state.objects[tome.objectId]!.zone).toBe("field");
      expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
      expect(game.state.objects[tome.objectId]!.counters["named:page"] ?? 0).toBe(damage);
      expect(game.state.objects[q.card(opponent).objectId]!.damage).toBe(0);
    });
});
