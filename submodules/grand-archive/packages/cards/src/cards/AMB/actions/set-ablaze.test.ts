import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import {
  createClassBonusTestChampion,
  grandArchiveDefaultFaceId,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { galesMare } from "../../RDO/allies/gales-mare.ts";
import { setAblaze } from "./set-ablaze.ts";

function championAt(classBonus: boolean, level: number) {
  const base = createClassBonusTestChampion(setAblaze, classBonus, "activation-discount");
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

/** @covers d4z3tj2nu8-a1 */
describe("Set Ablaze — deal 4 to an ally", () => {
  it("destroys the targeted ally and rejects champions", () => {
    const starter = championAt(false, 0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: starter,
        zones: {
          hand: [setAblaze, woodlandSquirrels, woodlandSquirrels],
          field: [galesMare],
        },
      },
      playerTwo: { champion: championAt(false, 0), zones: { field: [woodlandSquirrels] } },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const payment = player.cards(woodlandSquirrels, { zone: "hand" }).map((card) => ({
      kind: "card" as const,
      cardId: card.objectId,
    }));
    const before = game.state;
    expect(() =>
      player.activate(setAblaze, {
        reservePayment: payment,
        targets: { "target-1": [opponent.card(championAt(false, 0), { zone: "field" }).objectId] },
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
    const target = opponent.card(woodlandSquirrels, { zone: "field" });
    player.activate(setAblaze, {
      reservePayment: payment,
      targets: { "target-1": [target.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[target.objectId]!.zone).not.toBe("field");
    expect(
      game.state.objects[opponent.card(championAt(false, 0), { zone: "field" }).objectId]!.damage,
    ).toBe(0);
  });
});

/** @covers d4z3tj2nu8-a2 */
describe("Set Ablaze — Class Bonus Level 3+ same-controller champions", () => {
  it("deals 3 to the ally's controller's champion only when Class Bonus and level 3+ apply", () => {
    for (const [classBonus, level, expected] of [
      [true, 3, 3],
      [true, 2, 0],
      [false, 3, 0],
    ] as const) {
      const starter = championAt(classBonus, 0);
      const opponentStarter = championAt(false, 0);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion: starter,
          lineage: Array.from({ length: level }, (_, index) => championAt(classBonus, index + 1)),
          zones: {
            hand: [setAblaze, woodlandSquirrels, woodlandSquirrels],
            field: [galesMare],
          },
        },
        playerTwo: { champion: opponentStarter, zones: { field: [woodlandSquirrels] } },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const target = opponent.card(woodlandSquirrels, { zone: "field" });
      player.activate(setAblaze, {
        reservePayment: player.cards(woodlandSquirrels, { zone: "hand" }).map((card) => ({
          kind: "card" as const,
          cardId: card.objectId,
        })),
        targets: { "target-1": [target.objectId] },
      });
      passEffectsStack(game);
      expect(
        game.state.objects[opponent.card(opponentStarter, { zone: "field" }).objectId]!.damage,
      ).toBe(expected);
      expect(game.state.objects[player.card(starter, { zone: "field" }).objectId]!.damage).toBe(0);
    }
  });
});
