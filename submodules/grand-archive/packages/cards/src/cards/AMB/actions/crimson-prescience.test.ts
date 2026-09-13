import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { ferventBeastmaster } from "../../DOA/allies/fervent-beastmaster.ts";
import { galesMare } from "../../RDO/allies/gales-mare.ts";
import { crimsonPrescience } from "./crimson-prescience.ts";

function durableChampion(classBonus: boolean) {
  const base = createClassBonusTestChampion(crimsonPrescience, classBonus, "activation-discount");
  if (base.layout.kind !== "single-faced") throw new Error("expected single face");
  return {
    ...base,
    layout: {
      kind: "single-faced" as const,
      face: { ...base.layout.face, stats: { ...base.layout.face.stats, life: 40 } },
    },
  };
}

function dealChampionDamage(game: GrandArchiveTestEngine, hits: number) {
  const player = game.player("player-one");
  const opponent = game.player("player-two");
  const champion = player.zone("field")[0]!;
  for (const attacker of opponent.cards(ferventBeastmaster, { zone: "field" }).slice(0, hits)) {
    opponent.declareAttack(attacker, champion);
    game.resolveCombatWithoutRetaliation();
  }
}

/** @covers 0dsdojl6l3-a1 */
describe("Crimson Prescience — Class Bonus Damage 25+ discount", () => {
  for (const [classBonus, hits, cost] of [
    [true, 9, 2],
    [true, 8, 3],
    [false, 9, 3],
  ] as const) {
    it(`costs ${cost} when class=${classBonus} and damage=${hits * 3}`, { timeout: 15_000 }, () => {
      const champion = durableChampion(classBonus);
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: {
            hand: [crimsonPrescience, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: { field: Array.from({ length: 9 }, () => ferventBeastmaster) },
        },
      });
      dealChampionDamage(game, hits);
      game.player("player-two").pass();
      const player = game.player("player-one");
      const payment = player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, cost)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
      const before = game.state;
      expect(() =>
        player.activate(crimsonPrescience, { reservePayment: payment.slice(0, cost - 1) }),
      ).toThrow();
      expect(game.state).toEqual(before);
      player.activate(crimsonPrescience, { reservePayment: payment });
      expect(player.zone("memory")).toHaveLength(cost);
    });
  }
});

/** @covers 0dsdojl6l3-a2 */
describe("Crimson Prescience — prevent named source damage", () => {
  it("prevents champion damage from the chosen name and not from a different source", () => {
    const champion = durableChampion(true);
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: {
          hand: [crimsonPrescience, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: {
        champion,
        zones: { field: [woodlandSquirrels, galesMare] },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    opponent.pass();
    player.activate(crimsonPrescience, {
      reservePayment: player.cards(woodlandSquirrels, { zone: "hand" }).map((card) => ({
        kind: "card" as const,
        cardId: card.objectId,
      })),
    });
    passEffectsStack(game);
    answerDecision(game, "resolve-effect-choice", "Woodland Squirrels");
    passEffectsStack(game);
    const ownChampion = player.card(champion, { zone: "field" });
    opponent.declareAttack(woodlandSquirrels, ownChampion);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[ownChampion.objectId]!.damage).toBe(0);
    opponent.declareAttack(galesMare, ownChampion);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[ownChampion.objectId]!.damage).toBe(2);
  });
});
