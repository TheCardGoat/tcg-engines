import { describe, expect, it } from "bun:test";
import { hadesLookingForADeal } from "./056-hades-looking-for-a-deal";

/**
 * THE-881: Hades - Looking for a Deal effect stalls game
 *
 * The WHAT D'YA SAY? ability was incorrectly implemented as a
 * sequence(play-card, draw) which caused unresolvable game states.
 *
 * The correct implementation is:
 *   optional(chooser=CONTROLLER) wrapping
 *     choice(chooser=OPPONENT) with two options:
 *       1. put-on-bottom the chosen opposing character
 *       2. draw 2 cards for the controller
 */
describe("Hades - Looking for a Deal", () => {
  describe("WHAT D'YA SAY? ability structure", () => {
    // Biome-ignore lint/style/noNonNullAssertion: length check in first test guarantees existence
    const ability = hadesLookingForADeal.abilities![0] as {
      type: string;
      name: string;
      trigger: unknown;
      effect: {
        type: string;
        chooser: string;
        effect: {
          type: string;
          chooser: string;
          options: {
            type: string;
            amount?: number;
            target: {
              selector: string;
              owner: string;
              count: number;
              zones: string[];
              cardTypes: string[];
            };
          }[];
          optionLabels: string[];
        };
      };
    };

    it("should have exactly one ability", () => {
      expect(hadesLookingForADeal.abilities).toHaveLength(1);
    });

    it("should be a triggered ability on play", () => {
      expect(ability.type).toBe("triggered");
      expect(ability.trigger).toEqual({
        event: "play",
        on: "SELF",
        timing: "when",
      });
    });

    it("should have the correct ability name", () => {
      expect(ability.name).toBe("WHAT D'YA SAY?");
    });

    it("should have an optional effect controlled by CONTROLLER (you may choose)", () => {
      expect(ability.effect.type).toBe("optional");
      expect(ability.effect.chooser).toBe("CONTROLLER");
    });

    it("should NOT be a sequence(play-card, draw) — the broken implementation", () => {
      expect(ability.effect.type).not.toBe("sequence");
    });

    it("should have an opponent-controlled choice inside the optional", () => {
      const innerEffect = ability.effect.effect;
      expect(innerEffect).toBeDefined();
      expect(innerEffect.type).toBe("choice");
      expect(innerEffect.chooser).toBe("OPPONENT");
    });

    it("should have two options in the choice", () => {
      const choiceEffect = ability.effect.effect;
      expect(choiceEffect.options).toHaveLength(2);
    });

    it("should have put-on-bottom as the first option (opponent puts character on bottom)", () => {
      const choiceEffect = ability.effect.effect;
      const putOnBottom = choiceEffect.options[0];
      expect(putOnBottom.type).toBe("put-on-bottom");
      expect(putOnBottom.target).toBeDefined();
      expect(putOnBottom.target.selector).toBe("chosen");
      expect(putOnBottom.target.owner).toBe("opponent");
    });

    it("should have draw 2 as the second option (controller draws if opponent declines)", () => {
      const choiceEffect = ability.effect.effect;
      const draw = choiceEffect.options[1];
      expect(draw.type).toBe("draw");
      expect(draw.amount).toBe(2);
    });

    it("should have two option labels for the choice UI", () => {
      const choiceEffect = ability.effect.effect;
      expect(choiceEffect.optionLabels).toHaveLength(2);
    });
  });

  describe("Card properties", () => {
    it("should have correct card properties", () => {
      expect(hadesLookingForADeal.cardNumber).toBe(56);
      expect(hadesLookingForADeal.name).toBe("Hades");
      expect(hadesLookingForADeal.version).toBe("Looking for a Deal");
      expect(hadesLookingForADeal.cost).toBe(5);
      expect(hadesLookingForADeal.strength).toBe(3);
      expect(hadesLookingForADeal.willpower).toBe(4);
      expect(hadesLookingForADeal.lore).toBe(1);
      expect(hadesLookingForADeal.set).toBe("010");
    });
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { robinHoodTimelyContestant } from "@lorcanito/lorcana-engine/cards/005/characters/069-robin-hood-timely-contestant";
// Import {
//   DonaldGhostHunter,
//   HadesLookingForADeal,
//   MickeyMouseDetective,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Hades - Looking for a Deal", () => {
//   Describe("WHAT D'YA SAY? - Modal ability", () => {
//     It("should allow opponent to put their character on bottom of deck", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: hadesLookingForADeal.cost,
//           Hand: [hadesLookingForADeal],
//           Deck: 10,
//         },
//         {
//           Play: [donaldGhostHunter, mickeyMouseDetective],
//         },
//       );
//
//       Const targetCard = testEngine.getCardModel(donaldGhostHunter);
//       Await testEngine.playCard(
//         HadesLookingForADeal,
//         {
//           Targets: [targetCard],
//           AcceptOptionalLayer: true,
//         },
//         True,
//       );
//
//       TestEngine.changeActivePlayer("player_two");
//       Await testEngine.resolveTopOfStack({ mode: "1" });
//
//       Expect(targetCard.zone).toEqual("deck");
//       Expect(testEngine.getCardsByZone("hand", "player_one")?.length).toEqual(
//         0,
//       );
//       Expect(testEngine.getCardsByZone("hand", "player_two")?.length).toEqual(
//         0,
//       );
//     });
//
//     It("should allow opponent to let you draw 2 cards", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: hadesLookingForADeal.cost,
//           Hand: [hadesLookingForADeal],
//           Deck: 10,
//         },
//         {
//           Play: [donaldGhostHunter, mickeyMouseDetective],
//         },
//       );
//
//       Const targetCard = testEngine.getCardModel(mickeyMouseDetective);
//       Await testEngine.playCard(
//         HadesLookingForADeal,
//         {
//           Targets: [targetCard],
//           AcceptOptionalLayer: true,
//         },
//         True,
//       );
//
//       TestEngine.changeActivePlayer("player_two");
//       Await testEngine.resolveTopOfStack({ mode: "2" });
//
//       Expect(targetCard.zone).toEqual("play");
//       Expect(testEngine.getCardsByZone("hand", "player_one")?.length).toEqual(
//         2,
//       );
//       Expect(testEngine.getCardsByZone("hand", "player_two")?.length).toEqual(
//         0,
//       );
//     });
//   });
// });
//
// Describe("Regression", () => {
//   It("Shouldn't target characters with ward", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: hadesLookingForADeal.cost,
//         Hand: [hadesLookingForADeal],
//         Deck: 10,
//       },
//       {
//         Play: [
//           DonaldGhostHunter,
//           MickeyMouseDetective,
//           RobinHoodTimelyContestant,
//         ],
//       },
//     );
//
//     Const targetCard = testEngine.getCardModel(robinHoodTimelyContestant);
//     Await testEngine.playCard(
//       HadesLookingForADeal,
//       {
//         Targets: [targetCard],
//         AcceptOptionalLayer: true,
//       },
//       True,
//     );
//
//     Expect(testEngine.engine.store.priorityPlayer).toEqual("player_one");
//   });
// });
//
