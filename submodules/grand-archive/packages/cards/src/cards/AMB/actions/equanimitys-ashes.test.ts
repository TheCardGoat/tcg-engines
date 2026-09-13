import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import {
  createClassBonusTestChampion,
  grandArchiveDefaultFaceId,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { ferventBeastmaster } from "../../DOA/allies/fervent-beastmaster.ts";
import { equanimitysAshes } from "./equanimitys-ashes.ts";

function championAt(classBonus: boolean, level: number) {
  const base = createClassBonusTestChampion(equanimitysAshes, classBonus, "activation-discount");
  if (base.layout.kind !== "single-faced") throw new Error("expected single face");
  const canonicalId = `${base.canonicalId}-lv${level}`;
  return {
    ...base,
    canonicalId,
    slug: `${base.slug}-lv${level}`,
    layout: {
      kind: "single-faced" as const,
      face: {
        ...base.layout.face,
        id: grandArchiveDefaultFaceId(canonicalId),
        catalogId: canonicalId,
        stats: { ...base.layout.face.stats, level, life: 40 },
      },
    },
  };
}

function setup(classBonus: boolean, level: number, preDamageHits = 0) {
  const starter = championAt(classBonus, 0);
  const opponent = championAt(false, 0);
  const game = GrandArchiveTestEngine.startFixture({
    firstPlayer: "playerOne",
    playerOne: {
      champion: starter,
      lineage: Array.from({ length: level }, (_, index) => championAt(classBonus, index + 1)),
      zones: {
        hand: [equanimitysAshes, ...Array.from({ length: 5 }, () => woodlandSquirrels)],
        field: Array.from({ length: Math.max(preDamageHits, 1) }, () => ferventBeastmaster),
      },
    },
    playerTwo: {
      champion: opponent,
    },
  });
  if (preDamageHits > 0) {
    const player = game.player("player-one");
    const target = game.player("player-two").card(opponent, { zone: "field" });
    for (const attacker of player
      .cards(ferventBeastmaster, { zone: "field" })
      .slice(0, preDamageHits)) {
      player.declareAttack(attacker, target);
      game.resolveCombatWithoutRetaliation();
    }
  }
  return { game, starter, opponent };
}

/** @covers dZJBqul1Em-a1 */
describe("Equanimity's Ashes — Level 3+ activation discount", () => {
  for (const level of [2, 3]) {
    it(`${level >= 3 ? "costs 2" : "costs 5"} at level ${level}`, () => {
      const cost = level >= 3 ? 2 : 5;
      const { game, opponent } = setup(false, level);
      const player = game.player("player-one");
      const target = game.player("player-two").card(opponent, { zone: "field" });
      const payment = player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, cost)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
      const before = game.state;
      expect(() =>
        player.activate(equanimitysAshes, {
          reservePayment: payment.slice(0, cost - 1),
          targets: { "target-1": [target.objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      player.activate(equanimitysAshes, {
        reservePayment: payment,
        targets: { "target-1": [target.objectId] },
      });
      expect(player.zone("memory")).toHaveLength(cost);
    });
  }
});

/** @covers dZJBqul1Em-a2 */
describe("Equanimity's Ashes — deal 3 to a champion", () => {
  it("deals 3 to the targeted champion and rejects allies", () => {
    const { game, opponent } = setup(false, 3);
    const player = game.player("player-one");
    const target = game.player("player-two").card(opponent, { zone: "field" });
    const payment = player
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, 2)
      .map((card) => ({
        kind: "card" as const,
        cardId: card.objectId,
      }));
    const before = game.state;
    expect(() =>
      player.activate(equanimitysAshes, {
        reservePayment: payment,
        targets: {
          "target-1": [player.card(ferventBeastmaster, { zone: "field" }).objectId],
        },
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
    player.activate(equanimitysAshes, {
      reservePayment: payment,
      targets: { "target-1": [target.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[target.objectId]!.damage).toBe(3);
  });
});

/** @covers dZJBqul1Em-a3 */
describe("Equanimity's Ashes — Class Bonus extra 4 if five or less", () => {
  it("adds 4 more only with Class Bonus while the champion has five or less damage", () => {
    for (const [classBonus, hits, expected] of [
      [true, 0, 7],
      [true, 2, 3],
      [false, 0, 3],
    ] as const) {
      const { game, opponent } = setup(classBonus, 3, hits);
      const player = game.player("player-one");
      const target = game.player("player-two").card(opponent, { zone: "field" });
      player.activate(equanimitysAshes, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((card) => ({
            kind: "card" as const,
            cardId: card.objectId,
          })),
        targets: { "target-1": [target.objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]!.damage).toBe(hits * 3 + expected);
    }
  });
});
