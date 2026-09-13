import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import {
  createClassBonusTestChampion,
  grandArchiveDefaultFaceId,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { ferventBeastmaster } from "../../DOA/allies/fervent-beastmaster.ts";
import { nascentBarrier } from "./nascent-barrier.ts";

function championAt(classBonus: boolean, level: number) {
  const base = createClassBonusTestChampion(nascentBarrier, classBonus, "activation-discount");
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

/** @covers 6bc3ogf0o8-a1 */
describe("Nascent Barrier — Class Bonus prevent 1+LV", () => {
  it("prevents 1+LV champion damage once with Class Bonus and not without it", () => {
    for (const classBonus of [true, false]) {
      const starter = championAt(classBonus, 0);
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion: starter,
          lineage: [
            championAt(classBonus, 1),
            championAt(classBonus, 2),
            championAt(classBonus, 3),
          ],
          zones: { hand: [nascentBarrier, woodlandSquirrels, woodlandSquirrels] },
        },
        playerTwo: {
          champion: championAt(false, 0),
          zones: { field: [ferventBeastmaster, ferventBeastmaster] },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      opponent.pass();
      player.activate(nascentBarrier, {
        reservePayment: player.cards(woodlandSquirrels, { zone: "hand" }).map((card) => ({
          kind: "card" as const,
          cardId: card.objectId,
        })),
      });
      passEffectsStack(game);
      const ownChampion = player.card(starter, { zone: "field" });
      const attackers = opponent.cards(ferventBeastmaster, { zone: "field" });
      opponent.declareAttack(attackers[0]!, ownChampion);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[ownChampion.objectId]!.damage).toBe(classBonus ? 0 : 3);
      opponent.declareAttack(attackers[1]!, ownChampion);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[ownChampion.objectId]!.damage).toBe(classBonus ? 2 : 6);
    }
  });
});

/** @covers 6bc3ogf0o8-a2 */
describe("Nascent Barrier — Level 3+ Glimpse 3", () => {
  for (const level of [2, 3]) {
    it(`${level >= 3 ? "glimpses" : "does not glimpse"} at level ${level}`, () => {
      const starter = championAt(false, 0);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion: starter,
          lineage: Array.from({ length: level }, (_, index) => championAt(false, index + 1)),
          zones: {
            hand: [nascentBarrier, woodlandSquirrels, woodlandSquirrels],
            "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
          },
        },
        playerTwo: { champion: championAt(false, 0) },
      });
      const player = game.player("player-one");
      const deck = player.zone("main-deck");
      player.activate(nascentBarrier, {
        reservePayment: player.cards(woodlandSquirrels, { zone: "hand" }).map((card) => ({
          kind: "card" as const,
          cardId: card.objectId,
        })),
      });
      passEffectsStack(game);
      if (level < 3) {
        expect(game.state.decision).toBeNull();
        expect(player.zone("main-deck")).toEqual(deck);
        return;
      }
      const glimpse = game.state.decision;
      if (glimpse?.kind !== "resolve-glimpse") throw new Error("Expected Glimpse 3");
      expect(glimpse.cardIds).toEqual(deck.slice(0, 3).map((card) => card.objectId));
      answerDecision(game, "resolve-glimpse", {
        kind: "reorder",
        top: [deck[2]!.objectId],
        bottom: [deck[0]!.objectId, deck[1]!.objectId],
      });
      passEffectsStack(game);
      expect(player.zone("main-deck")).toEqual([deck[2], ...deck.slice(3), deck[0], deck[1]]);
    });
  }
});
