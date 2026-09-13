import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { nascentBlast } from "../../P24/actions/nascent-blast.ts";
import { rustedWarshield } from "../items/rusted-warshield.ts";
import { diffusiveBlock } from "./diffusive-block.ts";

/** @covers o7eanl1gxr-a1 */
describe("Diffusive Block — Shield discount", () => {
  for (const controlsShield of [false, true]) {
    it(`costs ${controlsShield ? 1 : 2} reserve when the controller ${controlsShield ? "has" : "does not have"} a Shield`, () => {
      const champion = createClassBonusTestChampion(diffusiveBlock, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [diffusiveBlock, woodlandSquirrels, woodlandSquirrels],
            ...(controlsShield ? { field: [rustedWarshield] } : {}),
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      const target = player.card(champion, { zone: "field" });
      const payment = player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, controlsShield ? 1 : 2)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
      const before = game.state;
      expect(() =>
        player.activate(diffusiveBlock, {
          reservePayment: payment.slice(1),
          targets: { "target-1": [target.objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);

      player.activate(diffusiveBlock, {
        reservePayment: payment,
        targets: { "target-1": [target.objectId] },
      });
      expect(player.zone("memory")).toHaveLength(payment.length);
    });
  }
});

/** @covers o7eanl1gxr-a2 */
describe("Diffusive Block — bounded damage prevention", () => {
  it("prevents two damage to the chosen unit once and then exhausts", () => {
    const champion = createClassBonusTestChampion(diffusiveBlock, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [
            diffusiveBlock,
            nascentBlast,
            nascentBlast,
            ...Array.from({ length: 8 }, () => woodlandSquirrels),
          ],
        },
      },
      playerTwo: { champion, zones: { field: [giantTortoise] } },
    });
    const player = game.player("player-one");
    const target = game.player("player-two").card(giantTortoise, { zone: "field" });
    const payments = player.cards(woodlandSquirrels, { zone: "hand" });
    const blasts = player.cards(nascentBlast, { zone: "hand" });
    player.activate(diffusiveBlock, {
      reservePayment: payments.slice(0, 2).map((card) => ({ kind: "card", cardId: card.objectId })),
      targets: { "target-1": [target.objectId] },
    });
    passEffectsStack(game);

    for (let index = 0; index < 2; index++) {
      player.activate(blasts[index]!, {
        reservePayment: payments
          .slice(2 + index * 3, 5 + index * 3)
          .map((card) => ({ kind: "card", cardId: card.objectId })),
        targets: { "target-1": [target.objectId] },
      });
      passEffectsStack(game);
    }
    expect(game.state.objects[target.objectId]!.damage).toBe(4);
  });
});

/** @covers o7eanl1gxr-a3 */
describe("Diffusive Block — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: diffusiveBlock });
});
