import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { galesMare } from "../../RDO/allies/gales-mare.ts";
import { zhangFeiSpiritedSteel } from "../allies/zhang-fei-spirited-steel.ts";
import { cavalierRescue } from "./cavalier-rescue.ts";
import { slipstreamVault } from "./slipstream-vault.ts";

/** @covers 6ilt42sehq-a1 */
describe("Slipstream Vault — Class Bonus unique-target discount", () => {
  it("costs 1 only when Class Bonus is on and the target is unique", () => {
    for (const [classBonus, unique, cost] of [
      [true, true, 1],
      [true, false, 2],
      [false, true, 2],
    ] as const) {
      const champion = createClassBonusTestChampion(
        slipstreamVault,
        classBonus,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [slipstreamVault, woodlandSquirrels, woodlandSquirrels],
            field: unique ? [zhangFeiSpiritedSteel] : [galesMare],
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      const target = player.card(unique ? zhangFeiSpiritedSteel : galesMare, { zone: "field" });
      const payment = player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, cost)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
      const before = game.state;
      expect(() =>
        player.activate(slipstreamVault, {
          reservePayment: payment.slice(0, cost - 1),
          targets: { "target-ally": [target.objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      player.activate(slipstreamVault, {
        reservePayment: payment,
        targets: { "target-ally": [target.objectId] },
      });
      expect(player.zone("memory")).toHaveLength(cost);
    }
  });
});

/** @covers 6ilt42sehq-a2 */
describe("Slipstream Vault — distant and negate targeting activations", () => {
  it("makes the ally distant and negates a stacked activation targeting it", () => {
    const champion = createClassBonusTestChampion(slipstreamVault, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: {
          hand: [slipstreamVault, woodlandSquirrels, woodlandSquirrels],
          field: [galesMare],
        },
      },
      playerTwo: {
        champion: createClassBonusTestChampion(cavalierRescue, false, "activation-discount"),
        zones: {
          hand: [cavalierRescue, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const ally = player.card(galesMare, { zone: "field" });
    opponent.activate(cavalierRescue, {
      reservePayment: opponent.cards(woodlandSquirrels, { zone: "hand" }).map((card) => ({
        kind: "card" as const,
        cardId: card.objectId,
      })),
      targets: { "target-1": [ally.objectId] },
    });
    opponent.pass();
    player.activate(slipstreamVault, {
      reservePayment: player.cards(woodlandSquirrels, { zone: "hand" }).map((card) => ({
        kind: "card" as const,
        cardId: card.objectId,
      })),
      targets: { "target-ally": [ally.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[ally.objectId]!.states.has("distant")).toBe(true);
    expect(game.state.objects[ally.objectId]!.counters.buff ?? 0).toBe(0);
    expect(opponent.cards(cavalierRescue, { zone: "graveyard" }).length).toBe(1);
  });
});
