import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  createClassBonusTestChampion,
  grandArchiveDefaultFaceId,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { trainingSword } from "../weapons/training-sword.ts";
import { proofOfLife } from "./proof-of-life.ts";

function durableChampion(life: number) {
  const champion = createClassBonusTestChampion(proofOfLife, true, "activation-discount");
  const face =
    champion.layout.kind === "single-faced" ? champion.layout.face : champion.layout.defaultFace;
  const canonicalId = `${champion.canonicalId}-life${life}`;
  return {
    ...champion,
    canonicalId,
    slug: canonicalId,
    layout: {
      kind: "single-faced" as const,
      face: {
        ...face,
        id: grandArchiveDefaultFaceId(canonicalId),
        catalogId: canonicalId,
        stats: { level: 0, life },
      },
    },
  };
}

/** @covers mes4idoihs-a1 */
describe("Proof of Life — double the next champion damage", () => {
  it("doubles only the next damage dealt to the controller's champion this turn", () => {
    const champion = durableChampion(30);
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: { hand: [proofOfLife, woodlandSquirrels] },
      },
      playerTwo: {
        champion,
        zones: { field: [automatedGardener, automatedGardener] },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    opponent.pass();
    const target = player.card(champion, { zone: "field" });
    player.activate(proofOfLife, {
      reservePayment: [
        { kind: "card", cardId: player.card(woodlandSquirrels, { zone: "hand" }).objectId },
      ],
    });
    passEffectsStack(game);
    const attackers = opponent.cards(automatedGardener, { zone: "field" });
    opponent.declareAttack(attackers[0]!, target);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(4);
    opponent.declareAttack(attackers[1]!, target);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(6);
  });
});

/** @covers mes4idoihs-a2 */
describe("Proof of Life — Damage 40+ graveyard wake", () => {
  it("wakes the champion from the graveyard only at forty or more damage", () => {
    for (const damage of [39, 42]) {
      const champion = durableChampion(50);
      const dealerBase = lineageTestChampion("Dealer", 0);
      const dealerFace = requireSingleFace(dealerBase);
      const dealer = {
        ...dealerBase,
        layout: {
          kind: "single-faced" as const,
          face: { ...dealerFace, stats: { level: 0, life: 20, power: damage } },
        },
      };
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            graveyard: [proofOfLife],
            hand: Array.from({ length: 2 }, () => woodlandSquirrels),
            field: [trainingSword],
            "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion: dealer,
          zones: { "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels) },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const target = player.card(champion, { zone: "field" });
      player.declareAttack(target, opponent.card(dealer, { zone: "field" }), {
        weaponIds: [player.card(trainingSword, { zone: "field" }).objectId],
      });
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(true);
      advanceToMain(game, opponent.id);
      opponent.declareAttack(dealer, target);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(damage);
      opponent.pass();
      const before = game.state;
      const options = {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      };
      if (damage < 40) {
        expect(() => player.activateAbility(proofOfLife, "mes4idoihs-a2", options)).toThrow();
        expect(game.state).toEqual(before);
      } else {
        player.activateAbility(proofOfLife, "mes4idoihs-a2", options);
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(false);
        expect(player.cards(proofOfLife, { zone: "banishment" })).toHaveLength(1);
      }
    }
  });
});
