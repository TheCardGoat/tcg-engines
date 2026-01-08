import type { CharacterCard } from "@tcg/lorcana-types";

export const mrsPottsEnchantedTeapot: CharacterCard = {
  id: "1mj",
  cardType: "character",
  name: "Mrs. Potts",
  version: "Enchanted Teapot",
  fullName: "Mrs. Potts - Enchanted Teapot",
  inkType: ["amethyst"],
  franchise: "Beauty and the Beast",
  set: "004",
  text: "IT'LL TURN OUT ALL RIGHT When you play this character, if you have a character named Lumiere or Cogsworth in play, you may draw a card.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 52,
  inkable: true,
  externalIds: {
    ravensburger: "d2fc1a97d9660d223273dc3416d8fa2ad2e68950",
  },
  abilities: [
    {
      id: "1mj-1",
      text: "IT'LL TURN OUT ALL RIGHT When you play this character, if you have a character named Lumiere or Cogsworth in play, you may draw a card.",
      name: "IT'LL TURN OUT ALL RIGHT",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
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
      },
    },
  ],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { ifYouHaveCharacterNamed } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const mrsPottsEnchantedTeapot: LorcanitoCharacterCard = {
//   id: "rxo",
//   missingTestCase: true,
//   name: "Mrs. Potts",
//   title: "Enchanted Teapot",
//   characteristics: ["storyborn", "ally"],
//   text: "**IT'LL TURN OUT ALL RIGHT** When you play this characters, if you have a character named Lumiere or Cogsworth in play, you may draw a card.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "It'll Turn Out All Right",
//       text: "When you play this characters, if you have a character named Lumiere or Cogsworth in play, you may draw a card.",
//       conditions: [ifYouHaveCharacterNamed(["Lumiere", "Cogsworth"])],
//       optional: true,
//       effects: [drawACard],
//     },
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 3,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Verionica Di Lorenzo / Livic Cacciatore",
//   number: 52,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 549620,
//   },
//   rarity: "rare",
// };
//
