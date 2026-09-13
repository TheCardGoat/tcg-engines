import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import {
  createClassBonusTestChampion,
  grandArchiveDefaultFaceId,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { galesMare } from "../../RDO/allies/gales-mare.ts";
import { invigoration } from "./invigoration.ts";

function championAt(level: number) {
  const base = createClassBonusTestChampion(invigoration, false, "activation-discount");
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

/** @covers 16hrusesqi-a1 */
describe("Invigoration — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({
    card: invigoration,
    discount: 2,
    preparation: "rested-ally",
  });
});

/** @covers 16hrusesqi-a2 */
describe("Invigoration — LV buffs on a rested ally", () => {
  for (const level of [0, 2]) {
    it(`puts ${level} buff counters at champion level ${level} and rejects awake allies`, () => {
      const champion = championAt(0);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          lineage: Array.from({ length: level }, (_, index) => championAt(index + 1)),
          zones: {
            hand: [invigoration, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
            field: [galesMare, woodlandSquirrels],
          },
        },
        playerTwo: { champion: championAt(0) },
      });
      const player = game.player("player-one");
      const rested = player.card(galesMare, { zone: "field" });
      const awake = player.card(woodlandSquirrels, { zone: "field" });
      player.declareAttack(
        rested,
        game.player("player-two").card(championAt(0), { zone: "field" }),
      );
      game.resolveCombatWithoutRetaliation();
      const payment = player.cards(woodlandSquirrels, { zone: "hand" }).map((card) => ({
        kind: "card" as const,
        cardId: card.objectId,
      }));
      const before = game.state;
      expect(() =>
        player.activate(invigoration, {
          reservePayment: payment,
          targets: { "target-1": [awake.objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      player.activate(invigoration, {
        reservePayment: payment,
        targets: { "target-1": [rested.objectId] },
      });
      expect(game.state.objects[rested.objectId]!.counters.buff ?? 0).toBe(0);
      passEffectsStack(game);
      expect(game.state.objects[rested.objectId]!.counters.buff ?? 0).toBe(level);
    });
  }
});
