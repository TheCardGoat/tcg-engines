import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { galesMare } from "../../RDO/allies/gales-mare.ts";
import { scorchingStrafe } from "./scorching-strafe.ts";

/** @covers 0k0p6n5nr7-a1 */
describe("Scorching Strafe — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: scorchingStrafe, discount: 2 });
});

/** @covers 0k0p6n5nr7-a2 */
describe("Scorching Strafe — +2 POWER and distant", () => {
  it("gives the targeted ally +2 combat power, makes it distant, and rejects non-allies", () => {
    const champion = createClassBonusTestChampion(scorchingStrafe, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [scorchingStrafe, woodlandSquirrels, woodlandSquirrels],
          field: [galesMare],
        },
      },
      playerTwo: { champion, zones: { field: [woodlandSquirrels] } },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const target = player.card(galesMare, { zone: "field" });
    const payment = player.cards(woodlandSquirrels, { zone: "hand" }).map((card) => ({
      kind: "card" as const,
      cardId: card.objectId,
    }));
    for (const invalid of [
      player.card(champion, { zone: "field" }),
      opponent.card(champion, { zone: "field" }),
    ]) {
      const before = game.state;
      expect(() =>
        player.activate(scorchingStrafe, {
          reservePayment: payment,
          targets: { "target-1": [invalid.objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
    }
    player.activate(scorchingStrafe, {
      reservePayment: payment,
      targets: { "target-1": [target.objectId] },
    });
    expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(false);
    passEffectsStack(game);
    expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(true);
    const defender = opponent.card(champion, { zone: "field" });
    player.declareAttack(target, defender);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[defender.objectId]!.damage).toBe(4);
  });
});
