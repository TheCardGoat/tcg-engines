import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { snowFairy } from "../../DOA/allies/snow-fairy.ts";
import { ghostsightGlass } from "./ghostsight-glass.ts";

/** @covers cc0jmpmman-a1 */
describe("Ghostsight Glass — True Sight", () => {
  it("pays three and rests to grant True Sight until end of turn", () => {
    const champion = createClassBonusTestChampion(ghostsightGlass, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [ghostsightGlass, woodlandSquirrels],
          hand: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion, zones: { field: [snowFairy] } },
    });
    const player = game.player("player-one");
    const ally = player.card(woodlandSquirrels, { zone: "field" });
    const hidden = game.player("player-two").card(snowFairy, { zone: "field" });
    const payments = player.cards(woodlandSquirrels, { zone: "hand" });
    expect(() => player.declareAttack(ally, hidden)).toThrow();
    const before = game.state;
    expect(() =>
      player.activateAbility(ghostsightGlass, "cc0jmpmman-a1", {
        targets: { "target-1": [ally.objectId] },
        reservePayment: payments.slice(0, 2).map((card) => ({
          kind: "card" as const,
          cardId: card.objectId,
        })),
      }),
    ).toThrow();
    expect(game.state).toEqual(before);

    player.activateAbility(ghostsightGlass, "cc0jmpmman-a1", {
      targets: { "target-1": [ally.objectId] },
      reservePayment: payments.map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    });
    expect(game.state.objects[player.card(ghostsightGlass).objectId]!.states.has("rested")).toBe(
      true,
    );
    expect(() => player.declareAttack(ally, hidden)).toThrow();
    passEffectsStack(game);
    player.declareAttack(ally, hidden);
    expect(game.state.combat?.targetIds).toEqual([hidden.objectId]);
  });
});
