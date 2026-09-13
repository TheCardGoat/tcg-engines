import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";
import { reposition } from "../../ALC/actions/reposition.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { huangZhongUnerringAim } from "./huang-zhong-unerring-aim.ts";

/** @covers XikXt8WyNp-a1 */
describe("Huang Zhong, Unerring Aim — Ranged 2", () => {
  proveRangedAlly({ card: huangZhongUnerringAim, power: 2, ranged: 2, classBonus: false });
});

/** @covers XikXt8WyNp-a2 */
describe("Huang Zhong, Unerring Aim — Class Bonus distant Rangers", () => {
  for (const classBonus of [false, true]) {
    for (const distant of [false, true]) {
      it(`classBonus=${classBonus}, already distant=${distant}`, () => {
        const champion = createClassBonusTestChampion(
          huangZhongUnerringAim,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [huangZhongUnerringAim],
              hand: [reposition, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
            },
          },
          playerTwo: { champion },
        });
        const player = game.player("player-one");
        const ally = player.card(huangZhongUnerringAim, { zone: "field" });
        const rangerChampion = player.card(champion, { zone: "field" });
        if (distant) {
          player.activate(reposition, {
            targets: { "target-1": [ally.objectId] },
            reservePayment: [
              {
                kind: "card",
                cardId: player.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId,
              },
            ],
          });
          passEffectsStack(game);
          expect(game.state.objects[ally.objectId]!.states.has("distant")).toBe(true);
        }
        const cost = distant ? 1 : 3;
        const payment = player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, cost)
          .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
        if (!classBonus) {
          const before = game.state;
          expect(() =>
            player.activateAbility(huangZhongUnerringAim, "XikXt8WyNp-a2", {
              reservePayment: payment,
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          return;
        }
        const underpay = game.state;
        expect(() =>
          player.activateAbility(huangZhongUnerringAim, "XikXt8WyNp-a2", {
            reservePayment: payment.slice(0, Math.max(0, cost - 1)),
          }),
        ).toThrow();
        expect(game.state).toEqual(underpay);
        player.activateAbility(huangZhongUnerringAim, "XikXt8WyNp-a2", { reservePayment: payment });
        expect(game.state.objects[ally.objectId]!.zone).toBe("memory");
        expect(game.state.objects[rangerChampion.objectId]!.states.has("distant")).toBe(false);
        passEffectsStack(game);
        expect(game.state.objects[ally.objectId]!.zone).toBe("memory");
        expect(game.state.objects[rangerChampion.objectId]!.states.has("distant")).toBe(true);
      });
    }
  }
});
