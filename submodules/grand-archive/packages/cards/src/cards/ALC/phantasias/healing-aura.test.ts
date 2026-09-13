import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { umbraSight } from "../actions/umbra-sight.ts";
import { healingAura } from "./healing-aura.ts";

/** @covers ao8bls6g7x-a1 */
describe("healing-aura — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: healingAura, discount: 1 });
});

/** @covers ao8bls6g7x-a2 */
describe("Healing Aura — recollection recovery", () => {
  it("triggers only for its controller and repeatedly recovers one, bounded at zero", () => {
    const champion = createClassBonusTestChampion(umbraSight, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [healingAura],
          hand: [umbraSight],
          "main-deck": Array.from({ length: 10 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion,
        zones: { "main-deck": Array.from({ length: 10 }, () => woodlandSquirrels) },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const source = player.card(healingAura);
    const ownChampion = player.card(champion);
    player.activate(player.card(umbraSight, { zone: "hand" }));
    passEffectsStack(game);
    answerDecision(game, "resolve-optional-effect", true);
    passEffectsStack(game);
    expect(game.state.objects[ownChampion.objectId]!.damage).toBe(2);

    for (const before of [2, 1, 0]) {
      advanceToRecollection(game, opponent.id);
      expect(game.state.stack).toHaveLength(0);
      expect(game.state.objects[ownChampion.objectId]!.damage).toBe(before);
      advanceToRecollection(game, player.id);
      expect(game.state.objects[ownChampion.objectId]!.damage).toBe(before);
      expect(game.state.stack).toHaveLength(1);
      expect(game.state.stack[0]).toMatchObject({
        kind: "triggered-ability",
        sourceId: source.objectId,
        ability: { id: "ao8bls6g7x-a2" },
      });
      passEffectsStack(game);
      expect(game.state.objects[ownChampion.objectId]!.damage).toBe(Math.max(0, before - 1));
    }
  });
});
