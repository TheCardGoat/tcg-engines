import { describe } from "vitest";
import { unmakeDuality } from "./unmake-duality.ts";
import { temporalSpectrometer } from "../../ALC/items/temporal-spectrometer.ts";
import { proveAdditionalPaymentDraw } from "../../../testing/additional-payment-draw.ts";

/** @covers uWLKGJz1GY-a1
 * @covers uWLKGJz1GY-a2
 */
describe("unmakeDuality payment and draw", () => {
  proveAdditionalPaymentDraw({ card: unmakeDuality, paymentCard: temporalSpectrometer });
});

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers uWLKGJz1GY-a1 @covers uWLKGJz1GY-a2 */
describe("Unmake Duality — requires Divine Relic", () => {
  for (const matching of [false, true])
    it(`rejects ordinary Regalia without consuming payment: class=${matching}`, () => {
      const champion = createClassBonusTestChampion(unmakeDuality, matching, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [trainingSword, temporalSpectrometer],
            hand: [unmakeDuality, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            "main-deck": [woodlandSquirrels, trainingSword, woodlandSquirrels],
          },
        },
        playerTwo: { champion },
      });
      const p = game.player("player-one"),
        sword = p.card(trainingSword, { zone: "field" }),
        relic = p.card(temporalSpectrometer);
      const reservePayment = p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
      const before = game.state,
        deck = p.zone("main-deck");
      expect(() =>
        p.activate(unmakeDuality, { reservePayment, costSelections: [[sword.objectId]] }),
      ).toThrow();
      expect(game.state).toEqual(before);
      p.activate(unmakeDuality, { reservePayment, costSelections: [[relic.objectId]] });
      expect(p.zone("banishment")).toContainEqual(relic);
      expect(p.zone("field")).toContainEqual(sword);
      expect(p.zone("memory")).toHaveLength(3);
      expect(p.zone("hand")).toHaveLength(0);
      expect(p.zone("main-deck")).toEqual(deck);
      passEffectsStack(game);
      expect(p.zone("hand")).toEqual(deck.slice(0, 2));
      expect(p.zone("main-deck")).toEqual(deck.slice(2));
      expect(p.cards(unmakeDuality, { zone: "graveyard" })).toHaveLength(1);
    });
});
