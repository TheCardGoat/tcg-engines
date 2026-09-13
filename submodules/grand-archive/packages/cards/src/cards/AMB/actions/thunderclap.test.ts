import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import {
  createClassBonusTestChampion,
  grandArchiveDefaultFaceId,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { galesMare } from "../../RDO/allies/gales-mare.ts";
import { thunderclap } from "./thunderclap.ts";

function championAt(level: number) {
  const base = createClassBonusTestChampion(thunderclap, false, "activation-discount");
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
        stats: { ...base.layout.face.stats, level },
      },
    },
  };
}

function setup(level: number) {
  const champion = championAt(0);
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      lineage: Array.from({ length: level }, (_, index) => championAt(index + 1)),
      zones: {
        hand: [thunderclap, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
        field: [galesMare],
      },
    },
    playerTwo: {
      champion: championAt(0),
      zones: { field: [woodlandSquirrels] },
    },
  });
  return game;
}

/** @covers 0xm513tj3j-a1 */
describe("Thunderclap — Level 3+ activation discount", () => {
  for (const level of [2, 3]) {
    it(`${level >= 3 ? "reduces" : "does not reduce"} its reserve cost at level ${level}`, () => {
      const cost = level >= 3 ? 2 : 4;
      const game = setup(level);
      const player = game.player("player-one");
      const target = game.player("player-two").card(woodlandSquirrels, { zone: "field" });
      const payment = player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, cost)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
      const before = game.state;
      expect(() =>
        player.activate(thunderclap, {
          reservePayment: payment.slice(0, cost - 1),
          targets: { "target-1": [target.objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      player.activate(thunderclap, {
        reservePayment: payment,
        targets: { "target-1": [target.objectId] },
      });
      expect(player.zone("memory")).toHaveLength(cost);
    });
  }
});

/** @covers 0xm513tj3j-a2 */
describe("Thunderclap — deal 4 to an ally", () => {
  it("deals 4 damage to the targeted ally and rejects champions", () => {
    const game = setup(3);
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const target = opponent.card(woodlandSquirrels, { zone: "field" });
    const payment = player
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, 2)
      .map((card) => ({
        kind: "card" as const,
        cardId: card.objectId,
      }));
    for (const invalid of [
      player.card(championAt(0), { zone: "field" }),
      opponent.card(championAt(0), { zone: "field" }),
    ]) {
      const before = game.state;
      expect(() =>
        player.activate(thunderclap, {
          reservePayment: payment,
          targets: { "target-1": [invalid.objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
    }
    player.activate(thunderclap, {
      reservePayment: payment,
      targets: { "target-1": [target.objectId] },
    });
    expect(game.state.objects[target.objectId]!.damage).toBe(0);
    passEffectsStack(game);
    expect(game.state.objects[target.objectId]!.zone).not.toBe("field");
  });
});
