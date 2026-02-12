import type { CharacterCard } from "@tcg/lorcana-types";

export const mrsPottsEnchantedTeapot: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          type: "has-named-character",
          name: "Lumiere or Cogsworth in play",
          controller: "you",
        },
        then: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        type: "conditional",
      },
      id: "1mj-1",
      name: "IT'LL TURN OUT ALL RIGHT",
      text: "IT'LL TURN OUT ALL RIGHT When you play this character, if you have a character named Lumiere or Cogsworth in play, you may draw a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 52,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "d2fc1a97d9660d223273dc3416d8fa2ad2e68950",
  },
  franchise: "Beauty and the Beast",
  fullName: "Mrs. Potts - Enchanted Teapot",
  id: "1mj",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  name: "Mrs. Potts",
  set: "004",
  strength: 3,
  text: "IT'LL TURN OUT ALL RIGHT When you play this character, if you have a character named Lumiere or Cogsworth in play, you may draw a card.",
  version: "Enchanted Teapot",
  willpower: 4,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { ifYouHaveCharacterNamed } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// Import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const mrsPottsEnchantedTeapot: LorcanitoCharacterCard = {
//   Id: "rxo",
//   MissingTestCase: true,
//   Name: "Mrs. Potts",
//   Title: "Enchanted Teapot",
//   Characteristics: ["storyborn", "ally"],
//   Text: "**IT'LL TURN OUT ALL RIGHT** When you play this characters, if you have a character named Lumiere or Cogsworth in play, you may draw a card.",
//   Type: "character",
//   Abilities: [
//     {
//       Type: "resolution",
//       Name: "It'll Turn Out All Right",
//       Text: "When you play this characters, if you have a character named Lumiere or Cogsworth in play, you may draw a card.",
//       Conditions: [ifYouHaveCharacterNamed(["Lumiere", "Cogsworth"])],
//       Optional: true,
//       Effects: [drawACard],
//     },
//   ],
//   Inkwell: true,
//   Colors: ["amethyst"],
//   Cost: 4,
//   Strength: 3,
//   Willpower: 4,
//   Lore: 2,
//   Illustrator: "Verionica Di Lorenzo / Livic Cacciatore",
//   Number: 52,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 549620,
//   },
//   Rarity: "rare",
// };
//
