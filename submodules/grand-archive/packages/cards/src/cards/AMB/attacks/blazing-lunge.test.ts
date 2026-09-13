import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { classBonusLeveledChampion } from "../../../testing/class-bonus-level.ts";
import { declareResolvedAttack, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { heatedVengeance } from "./heated-vengeance.ts";
import { blazingLunge } from "./blazing-lunge.ts";

/** @covers wewvlfkfp7-a1 */
describe("Blazing Lunge — Class Bonus unpreventable combat damage", () => {
  it("activates from intent after banishing two fire cards", () => {
    const { starter } = classBonusLeveledChampion(blazingLunge, true, 0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: starter,
        zones: {
          hand: [blazingLunge, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          graveyard: [heatedVengeance, heatedVengeance, woodlandSquirrels],
        },
      },
      playerTwo: { champion: starter },
    });
    const player = game.player("player-one");
    const attacker = player.card(starter, { zone: "field" });
    const fires = player.cards(heatedVengeance, { zone: "graveyard" });
    const before = game.state;
    expect(() =>
      player.activateAbility(blazingLunge, "wewvlfkfp7-a1", {
        costSelections: [fires.map((card) => card.objectId)],
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
    player.activate(blazingLunge, {
      attackAttackerId: attacker.objectId,
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
    });
    passEffectsStack(game);
    declareResolvedAttack(
      game,
      attacker.objectId,
      game.player("player-two").card(starter, { zone: "field" }).objectId,
      "declare Blazing Lunge",
    );
    const intent = player.card(blazingLunge);
    player.activateAbility(intent, "wewvlfkfp7-a1", {
      costSelections: [fires.map((card) => card.objectId)],
    });
    passEffectsStack(game);
    expect(player.cards(heatedVengeance, { zone: "banishment" })).toHaveLength(2);
    game.resolveCombatWithoutRetaliation();
    expect(
      game.state.objects[game.player("player-two").card(starter, { zone: "field" }).objectId]!
        .damage,
    ).toBe(4);
  });
});
