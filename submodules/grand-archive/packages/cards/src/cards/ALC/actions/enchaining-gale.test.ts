import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { sealedBladeDoa } from "../../DOA/weapons/sealed-blade-doa.ts";
import { enchainingGale } from "./enchaining-gale.ts";

/** @covers xhs5jwsl7d-a1 */
describe("enchaining-gale — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: enchainingGale, discount: 1 });
});

/** @covers xhs5jwsl7d-a2 */
describe("Enchaining Gale — suppress", () => {
  it("temporarily banishes only an ally and returns it at the next end phase", () => {
    const champion = createClassBonusTestChampion(enchainingGale, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [enchainingGale, woodlandSquirrels],
          field: [sealedBladeDoa],
          "main-deck": [woodlandSquirrels],
        },
      },
      playerTwo: {
        champion,
        zones: { field: [woodlandSquirrels], "main-deck": [woodlandSquirrels] },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const payment = player.card(woodlandSquirrels, { zone: "hand" });
    const target = opponent.card(woodlandSquirrels, { zone: "field" });
    for (const invalid of [
      player.card(sealedBladeDoa, { zone: "field" }),
      opponent.card(champion, { zone: "field" }),
    ]) {
      const before = game.state;
      expect(() =>
        player.activate(enchainingGale, {
          reservePayment: [{ kind: "card", cardId: payment.objectId }],
          targets: { "target-1": [invalid.objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
    }

    player.activate(enchainingGale, {
      reservePayment: [{ kind: "card", cardId: payment.objectId }],
      targets: { "target-1": [target.objectId] },
    });
    passEffectsStack(game);
    expect(opponent.cards(woodlandSquirrels, { zone: "banishment" })).toEqual([target]);

    for (let step = 0; step < 64; step++) {
      if (game.state.stack.some((item) => item.kind === "triggered-ability")) break;
      const wait = game.waitState();
      if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
      game.player(wait.playerId).pass();
    }
    expect(game.state.turn.phase).toBe("end");
    expect(opponent.cards(woodlandSquirrels, { zone: "banishment" })).toEqual([target]);
    passEffectsStack(game);
    expect(opponent.cards(woodlandSquirrels, { zone: "field" })).toEqual([target]);
  });
});
