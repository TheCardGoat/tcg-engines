import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { oasisTradingPost } from "../domains/oasis-trading-post.ts";
import { seekersRifle } from "../weapons/seekers-rifle.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { proveFloatingMemory } from "../../../testing/floating-memory.ts";
import { razeTheLand } from "./raze-the-land.ts";

/** @covers 6i0iqmyn2r-a2 */
describe("Raze the Land — Floating Memory", () => {
  proveFloatingMemory(razeTheLand);
});

/** @covers 6i0iqmyn2r-a1 */
describe("Raze the Land — destroy a domain", () => {
  for (const owner of ["player-one", "player-two"] as const) {
    it(`destroys only the selected ${owner} domain on resolution`, () => {
      const champion = createClassBonusTestChampion(razeTheLand, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [oasisTradingPost, seekersRifle, woodlandSquirrels],
            hand: [razeTheLand, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { field: [oasisTradingPost] } },
      });
      const player = game.player("player-one");
      const payment = player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
      for (const invalid of [champion, seekersRifle, woodlandSquirrels]) {
        const before = game.state.stateVersion;
        expect(() =>
          player.activate(razeTheLand, {
            reservePayment: payment,
            targets: { "target-1": [player.card(invalid, { zone: "field" }).objectId] },
          }),
        ).toThrow();
        expect(game.state.stateVersion).toBe(before);
      }
      const target = game.player(owner).card(oasisTradingPost, { zone: "field" });
      const other = game
        .player(owner === "player-one" ? "player-two" : "player-one")
        .card(oasisTradingPost, { zone: "field" });
      player.activate(razeTheLand, {
        reservePayment: payment,
        targets: { "target-1": [target.objectId] },
      });
      expect(game.state.objects[target.objectId]!.zone).toBe("field");
      expect(player.zone("memory")).toHaveLength(3);
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]!.zone).toBe("graveyard");
      expect(game.player(owner).zone("graveyard")).toContainEqual(target);
      expect(game.state.objects[other.objectId]!.zone).toBe("field");
    });
  }
});
