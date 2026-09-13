import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trumpSet } from "../../P26/actions/trump-set.ts";
import { shimmercloakAssassin } from "../allies/shimmercloak-assassin.ts";
import { potionOfHealing } from "../items/potion-of-healing.ts";
import { reposition } from "./reposition.ts";
import { enhanceHearing } from "./enhance-hearing.ts";

/** @covers edg616r0za-a1 */
describe("enhance-hearing — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: enhanceHearing, discount: 1 });
});

/** @covers edg616r0za-a2 */
describe("Enhance Hearing — wind-or-Reaction top-card selection", () => {
  for (const selectedKind of ["wind", "reaction", "none"] as const) {
    it(`${selectedKind === "none" ? "declines" : `selects the ${selectedKind} branch`} and orders the remainder`, () => {
      const champion = createClassBonusTestChampion(enhanceHearing, true, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [enhanceHearing, woodlandSquirrels, woodlandSquirrels],
            "main-deck": [shimmercloakAssassin, trumpSet, potionOfHealing, reposition],
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      const deck = player.zone("main-deck");
      const payment = player.cards(woodlandSquirrels, { zone: "hand" });
      player.activate(enhanceHearing, {
        reservePayment: payment.map((card) => ({ kind: "card", cardId: card.objectId })),
      });
      passEffectsStack(game);
      expect(game.state.decision?.kind).toBe("resolve-effect-choice");

      const ineligible = deck[2]!;
      const outsideTopThree = deck[3]!;
      for (const invalid of [[ineligible.objectId], [outsideTopThree.objectId]]) {
        const before = game.state;
        expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
        expect(game.state).toEqual(before);
      }
      const selected =
        selectedKind === "wind" ? deck[0]! : selectedKind === "reaction" ? deck[1]! : null;
      answerDecision(game, "resolve-effect-choice", selected ? [selected.objectId] : []);
      passEffectsStack(game);

      const remainder = deck.slice(0, 3).filter((card) => card.objectId !== selected?.objectId);
      expect(game.state.decision?.kind).toBe("resolve-effect-choice");
      const orderedRemainder = [...remainder].reverse();
      answerDecision(
        game,
        "resolve-effect-choice",
        orderedRemainder.map((card) => card.objectId),
      );
      passEffectsStack(game);

      expect(player.zone("hand")).toEqual(selected ? [selected] : []);
      expect(player.zone("memory")).toEqual(payment);
      expect(player.zone("main-deck")).toEqual([outsideTopThree, ...orderedRemainder]);
      expect(game.state.decision).toBeNull();
    });
  }
});
