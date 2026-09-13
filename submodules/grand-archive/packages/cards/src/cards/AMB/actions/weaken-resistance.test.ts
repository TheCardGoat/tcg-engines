import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import {
  createClassBonusTestChampion,
  grandArchiveDefaultFaceId,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { galesMare } from "../../RDO/allies/gales-mare.ts";
import { weakenResistance } from "./weaken-resistance.ts";

function championAt(level: number): GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> {
  const base = createClassBonusTestChampion(weakenResistance, true, "activation-discount");
  if (base.layout.kind !== "single-faced") throw new Error("expected single face");
  const baseFace = requireSingleFace(base);
  const canonicalId = `${base.canonicalId}-lv${level}`;
  return {
    ...base,
    canonicalId,
    slug: `${base.slug}-lv${level}`,
    layout: {
      kind: "single-faced" as const,
      face: {
        ...baseFace,
        id: grandArchiveDefaultFaceId(canonicalId),
        catalogId: canonicalId,
        elements: ["NORM", "FIRE"],
        stats: { ...baseFace.stats, level, life: 40 },
      },
    },
  };
}

/** @covers bb3oeup7oq-a1 */
describe("Weaken Resistance — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: weakenResistance, discount: 1 });
});

/** @covers bb3oeup7oq-a2 */
describe("Weaken Resistance — next Spell damage plus LV", () => {
  it("adds LV to the next Spell damage and ignores a combat hit", () => {
    const starter = championAt(0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: starter,
        lineage: [championAt(1), championAt(2), championAt(3)],
        zones: {
          hand: [weakenResistance, fireball, ...Array.from({ length: 6 }, () => woodlandSquirrels)],
          field: [galesMare],
        },
      },
      playerTwo: { champion: championAt(0), zones: { field: [woodlandSquirrels] } },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const unit = opponent.card(championAt(0), { zone: "field" });
    const payment = player.cards(woodlandSquirrels, { zone: "hand" });
    player.activate(weakenResistance, {
      reservePayment: payment.slice(0, 3).map((card) => ({
        kind: "card" as const,
        cardId: card.objectId,
      })),
      targets: { "target-1": [unit.objectId] },
    });
    passEffectsStack(game);
    player.declareAttack(galesMare, unit);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[unit.objectId]!.damage).toBe(2);
    player.activate(fireball, {
      reservePayment: payment.slice(3, 5).map((card) => ({
        kind: "card" as const,
        cardId: card.objectId,
      })),
      targets: { "target-1": [unit.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[unit.objectId]!.damage).toBe(2 + 4 + 3);
  });
});
