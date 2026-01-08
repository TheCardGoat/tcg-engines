import type { CharacterCard } from "@tcg/lorcana-types";

export const brunoMadrigalOutOfTheShadows: CharacterCard = {
  id: "1qi",
  cardType: "character",
  name: "Bruno Madrigal",
  version: "Out of the Shadows",
  fullName: "Bruno Madrigal - Out of the Shadows",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "004",
  text: "IT WAS YOUR VISION When you play this character, chosen character gains “When this character is banished in a challenge, you may return this card to your hand” this turn.",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 1,
  cardNumber: 38,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e14d5d0b9b6bc59f80886c989f265721cdc6c6fc",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Madrigal"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { returnThisCardToHand } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const brunoMadrigalOutOfTheShadows: LorcanitoCharacterCard = {
//   id: "nsx",
//   missingTestCase: true,
//   name: "Bruno Madrigal",
//   title: "Out of the Shadows",
//   characteristics: ["storyborn", "ally", "madrigal"],
//   text: '**IT WAS YOUR VISION** When you play this character, chosen character gains "When this character is banished in a challenge, you may return this card to your hand" this turn.',
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Work Together",
//       text: "Chosen character gains **Support** this turn.",
//       effects: [
//         {
//           type: "ability",
//           ability: "custom",
//           customAbility: whenThisCharacterBanished({
//             name: "It was your vision",
//             text: "When this character is banished in a challenge, you may return this card to your hand.",
//             optional: true,
//             effects: [returnThisCardToHand],
//           }),
//           modifier: "add",
//           duration: "turn",
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   colors: ["amethyst"],
//   cost: 5,
//   strength: 4,
//   willpower: 5,
//   lore: 1,
//   illustrator: "Aubrey Archer",
//   number: 38,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 543899,
//   },
//   rarity: "rare",
// };
//
