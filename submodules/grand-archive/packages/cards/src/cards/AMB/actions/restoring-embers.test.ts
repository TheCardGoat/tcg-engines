import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { ferventBeastmaster } from "../../DOA/allies/fervent-beastmaster.ts";
import { restoringEmbers } from "./restoring-embers.ts";

function durableChampion() {
  const base = createClassBonusTestChampion(restoringEmbers, false, "activation-discount");
  if (base.layout.kind !== "single-faced") throw new Error("expected single face");
  return {
    ...base,
    layout: {
      kind: "single-faced" as const,
      face: { ...base.layout.face, stats: { ...base.layout.face.stats, life: 40 } },
    },
  };
}

/** @covers FnTT1G4OQg-a1 */
describe("Restoring Embers — Kindle 4", () => {
  it("lets fire graveyard cards pay reserve and rejects a non-fire card", () => {
    const champion = durableChampion();
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [restoringEmbers],
          graveyard: [fireball, fireball, fireball, fireball, woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const fire = player.cards(fireball, { zone: "graveyard" });
    const before = game.state;
    expect(() =>
      player.activate(restoringEmbers, {
        kindleCardIds: [player.card(woodlandSquirrels, { zone: "graveyard" }).objectId],
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
    player.activate(restoringEmbers, {
      kindleCardIds: fire.map((card) => card.objectId),
    });
    expect(player.zone("memory")).toHaveLength(0);
    for (const card of fire) expect(game.state.objects[card.objectId]!.zone).toBe("banishment");
  });
});

/** @covers FnTT1G4OQg-a2 */
describe("Restoring Embers — recover then influence draw", () => {
  it("recovers 4 and draws into memory only at influence 4 or less", () => {
    for (const influence of [4, 5]) {
      const champion = durableChampion();
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: {
            hand: [
              restoringEmbers,
              ...Array.from({ length: Math.max(influence, 4) }, () => woodlandSquirrels),
            ],
            "main-deck": [woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: { field: Array.from({ length: 2 }, () => ferventBeastmaster) },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const ownChampion = player.card(champion, { zone: "field" });
      for (const attacker of opponent.cards(ferventBeastmaster, { zone: "field" })) {
        opponent.declareAttack(attacker, ownChampion);
        game.resolveCombatWithoutRetaliation();
      }
      opponent.pass();
      const deck = player.zone("main-deck");
      player.activate(restoringEmbers, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 4)
          .map((card) => ({
            kind: "card" as const,
            cardId: card.objectId,
          })),
      });
      passEffectsStack(game);
      expect(game.state.objects[ownChampion.objectId]!.damage).toBe(2);
      expect(player.zone("memory")).toHaveLength(influence <= 4 ? 5 : 4);
      if (influence <= 4) expect(player.zone("memory")).toContainEqual(deck[0]);
    }
  });
});
