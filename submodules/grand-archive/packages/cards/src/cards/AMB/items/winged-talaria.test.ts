import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { wingedTalaria } from "./winged-talaria.ts";

/** @covers yfid3xuxax-a1 */
describe("Winged Talaria — distant", () => {
  it("pays two and banishes itself to make a unit distant", () => {
    const champion = createClassBonusTestChampion(wingedTalaria, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [wingedTalaria, woodlandSquirrels],
          hand: [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const ally = player.card(woodlandSquirrels, { zone: "field" });
    const payments = player.cards(woodlandSquirrels, { zone: "hand" });
    const before = game.state;
    expect(() =>
      player.activateAbility(wingedTalaria, "yfid3xuxax-a1", {
        targets: { "target-1": [ally.objectId] },
        reservePayment: [{ kind: "card", cardId: payments[0]!.objectId }],
      }),
    ).toThrow();
    expect(game.state).toEqual(before);

    player.activateAbility(wingedTalaria, "yfid3xuxax-a1", {
      targets: { "target-1": [ally.objectId] },
      reservePayment: payments.map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    });
    expect(player.cards(wingedTalaria, { zone: "field" })).toHaveLength(0);
    expect(game.state.objects[ally.objectId]!.states.has("distant")).toBe(false);
    passEffectsStack(game);
    expect(game.state.objects[ally.objectId]!.states.has("distant")).toBe(true);
    expect(player.card(wingedTalaria, { zone: "banishment" }).definitionId).toBe(
      wingedTalaria.canonicalId,
    );
  });
});
