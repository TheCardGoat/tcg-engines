import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { chaliceOfBlood } from "./chalice-of-blood.ts";
import { fireball } from "../actions/fireball.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers UiohpiTtgs-a1 */
describe("Chalice of Blood's twenty-damage threshold", () => {
  for (const damage of [19, 20, 21])
    it(`requires at least twenty damage: ${damage}`, () => {
      const base = createClassBonusTestChampion(chaliceOfBlood, false, "activation-discount"),
        champion = {
          ...base,
          layout: {
            kind: "single-faced" as const,
            face: { ...requireSingleFace(base), stats: { level: 0, life: 40 } },
          },
        },
        opponent = grantTestChampionLevel(
          createClassBonusTestChampion(fireball, false, "activation-discount"),
          damage - 1,
        );
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: {
            field: [chaliceOfBlood],
            "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion: opponent,
          zones: { hand: [fireball, ...Array.from({ length: 4 }, () => woodlandSquirrels)] },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        hero = p.card(champion);
      q.activate(fireball, {
        reservePayment: q
          .cards(woodlandSquirrels)
          .map((c) => ({ kind: "card", cardId: c.objectId })),
        targets: { "target-1": [hero.objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
      q.pass();
      if (damage < 20) {
        const before = game.state;
        expect(() => p.activateAbility(chaliceOfBlood, "UiohpiTtgs-a1")).toThrow();
        expect(game.state).toEqual(before);
        return;
      }
      p.activateAbility(chaliceOfBlood, "UiohpiTtgs-a1");
      expect(p.cards(chaliceOfBlood, { zone: "banishment" })).toHaveLength(1);
      expect(p.zone("hand")).toHaveLength(0);
      passEffectsStack(game);
      expect(p.zone("hand")).toHaveLength(2);
      expect(p.zone("main-deck")).toHaveLength(1);
      expect(q.zone("hand")).toHaveLength(0);
      expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
    });
});
