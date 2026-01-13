import type { CharacterCard } from "@tcg/lorcana-types";

export const balooVonBruinwaldXiii: CharacterCard = {
  id: "owv",
  cardType: "character",
  name: "Baloo",
  version: "von Bruinwald XIII",
  fullName: "Baloo - von Bruinwald XIII",
  inkType: ["amber"],
  franchise: "Talespin",
  set: "003",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nLET'S MAKE LIKE A TREE When this character is banished, gain 2 lore.",
  cost: 3,
  strength: 0,
  willpower: 3,
  lore: 1,
  cardNumber: 1,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "59ca12ef2ed51d7e5c544d6de0d81a98cc06daee",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const balooVonBruinwaldXiii: LorcanitoCharacterCard = {
//   id: "p52",
//   missingTestCase: true,
//   name: "Baloo",
//   title: "Von Bruinwald XIII",
//   characteristics: ["hero", "dreamborn"],
//   text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_\n\n\n**LET'S MAKE LIKE A TREE** When this character is banished, gain 2 lore.",
//   type: "character",
//   abilities: [
//     bodyguardAbility,
//     whenThisCharacterBanished({
//       name: "Let's make like a tree",
//       text: "When this character is banished, gain 2 lore.",
//       effects: [
//         {
//           type: "lore",
//           amount: 2,
//           modifier: "add",
//           target: self,
//         },
//       ],
//     }),
//   ],
//   colors: ["amber"],
//   willpower: 3,
//   strength: 0,
//   cost: 3,
//   lore: 1,
//   illustrator: "Cam Kendell",
//   number: 1,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 539060,
//   },
//   rarity: "rare",
// };
//
