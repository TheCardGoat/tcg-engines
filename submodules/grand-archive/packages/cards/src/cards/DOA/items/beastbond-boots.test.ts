import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { beastbondBoots } from "./beastbond-boots.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { grayWolf } from "../allies/gray-wolf.ts";
import { blitzMage } from "../allies/blitz-mage.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { fireball } from "../actions/fireball.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers xjuCkODVRx-a1 */
describe("Beastbond Boots' conditional spellshroud", () => {
  for (const ally of [giantTortoise, grayWolf, blitzMage])
    it(`requires an own field Animal or Beast: ${ally.slug}`, () => {
      const champion = createClassBonusTestChampion(fireball, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [beastbondBoots, ally],
            graveyard: [giantTortoise],
            hand: [
              fireball,
              woodlandSquirrels,
              woodlandSquirrels,
              woodlandSquirrels,
              woodlandSquirrels,
            ],
            "main-deck": [woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [giantTortoise],
            hand: [
              fireball,
              woodlandSquirrels,
              woodlandSquirrels,
              woodlandSquirrels,
              woodlandSquirrels,
            ],
            "main-deck": [woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        boots = p.card(beastbondBoots);
      if (ally === blitzMage) {
        const before = game.state;
        expect(() => p.activateAbility(boots, "xjuCkODVRx-a1")).toThrow();
        expect(game.state).toEqual(before);
        return;
      }
      p.activateAbility(boots, "xjuCkODVRx-a1");
      expect(game.state.objects[boots.objectId]!.zone).toBe("banishment");
      passEffectsStack(game);
      const payment = p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const before = game.state;
      expect(() =>
        p.activate(fireball, {
          reservePayment: payment,
          targets: { "target-1": [p.card(champion).objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      p.activate(fireball, {
        reservePayment: payment,
        targets: { "target-1": [q.card(champion).objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(1);
      advanceToMain(game, q.id);
      q.activate(fireball, {
        reservePayment: q
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 4)
          .map((c) => ({ kind: "card", cardId: c.objectId })),
        targets: { "target-1": [p.card(champion).objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(1);
    });
});
