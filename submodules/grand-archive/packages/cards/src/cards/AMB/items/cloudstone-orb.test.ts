import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { shimmercloakAssassin } from "../../ALC/allies/shimmercloak-assassin.ts";
import { snowFairy } from "../../DOA/allies/snow-fairy.ts";
import { cloudstoneOrb } from "./cloudstone-orb.ts";

/** @covers ygqehvpblj-a1 */
describe("Cloudstone Orb — Empower X on enter", () => {
  it("Empowers equal to other controlled wind non-champion objects", () => {
    const champion = createClassBonusTestChampion(cloudstoneOrb, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion,
        zones: {
          field: [shimmercloakAssassin, snowFairy],
          "material-deck": [cloudstoneOrb],
        },
      },
      playerTwo: { champion, zones: { field: [shimmercloakAssassin] } },
    });
    const player = game.player("player-one");
    player.materialize(cloudstoneOrb);
    player.pass();
    game.player("player-two").pass();
    expect(
      game.state.stack.some(
        (item) => item.kind === "triggered-ability" && item.ability.id === "ygqehvpblj-a1",
      ),
    ).toBe(true);
    expect(game.state.players[player.id]!.states.empower).toBeUndefined();
    passEffectsStack(game);
    expect(game.state.players[player.id]!.states.empower).toBe(2);
  });
});

/** @covers ygqehvpblj-a2 */
describe("Cloudstone Orb — Class Bonus return", () => {
  for (const classBonus of [false, true]) {
    it(`${classBonus ? "returns" : "rejects"} the orb to the material deck (class=${classBonus})`, () => {
      const champion = createClassBonusTestChampion(
        cloudstoneOrb,
        classBonus,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [cloudstoneOrb],
            hand: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      const payments = player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
      if (!classBonus) {
        const before = game.state;
        expect(() =>
          player.activateAbility(cloudstoneOrb, "ygqehvpblj-a2", { reservePayment: payments }),
        ).toThrow();
        expect(game.state).toEqual(before);
        return;
      }
      player.activateAbility(cloudstoneOrb, "ygqehvpblj-a2", { reservePayment: payments });
      expect(player.cards(cloudstoneOrb, { zone: "field" })).toHaveLength(1);
      passEffectsStack(game);
      expect(player.cards(cloudstoneOrb, { zone: "material-deck" })).toHaveLength(1);
    });
  }
});
