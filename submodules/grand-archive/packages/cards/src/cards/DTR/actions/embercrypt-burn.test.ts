import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { embercryptBurn } from "./embercrypt-burn.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers k2d3ca13yr-a1 */
describe("Embercrypt Burn — graveyard banishment and champion-only damage", () => {
  for (const own of [false, true])
    it(`banishes a card from ${own ? "own" : "opposing"} graveyard and damages both champions`, () => {
      const champion = createClassBonusTestChampion(embercryptBurn, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [embercryptBurn, woodlandSquirrels, woodlandSquirrels],
            field: [giantTortoise],
            graveyard: [woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [giantTortoise],
            hand: [woodlandSquirrels],
            graveyard: [woodlandSquirrels],
            banishment: [giantTortoise],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        target = (own ? p : q).card(woodlandSquirrels, { zone: "graveyard" });
      const reservePayment = p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      for (const invalid of [
        q.card(woodlandSquirrels, { zone: "hand" }),
        q.card(giantTortoise, { zone: "field" }),
        q.card(giantTortoise, { zone: "banishment" }),
        q.card(champion),
      ]) {
        const before = game.state;
        expect(() =>
          p.activate(embercryptBurn, {
            targets: { "target-card": [invalid.objectId] },
            reservePayment,
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }
      p.activate(embercryptBurn, { targets: { "target-card": [target.objectId] }, reservePayment });
      expect(game.state.objects[target.objectId]!.zone).toBe("graveyard");
      for (const player of [p, q])
        expect(game.state.objects[player.card(champion).objectId]!.damage).toBe(0);
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]!.zone).toBe("banishment");
      expect((own ? q : p).cards(woodlandSquirrels, { zone: "graveyard" })).toHaveLength(1);
      for (const player of [p, q]) {
        expect(game.state.objects[player.card(champion).objectId]!.damage).toBe(2);
        expect(
          game.state.objects[player.card(giantTortoise, { zone: "field" }).objectId]!.damage,
        ).toBe(0);
      }
    });
});
