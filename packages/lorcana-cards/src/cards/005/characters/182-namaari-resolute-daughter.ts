import type { CharacterCard } from "@tcg/lorcana-types";

export const namaariResoluteDaughter: CharacterCard = {
  id: "1t7",
  cardType: "character",
  name: "Namaari",
  version: "Resolute Daughter",
  fullName: "Namaari - Resolute Daughter",
  inkType: ["steel"],
  franchise: "Raya and the Last Dragon",
  set: "005",
  text: "I DON'T HAVE ANY OTHER CHOICE For each opposing character banished in a challenge this turn, you pay 2 {I} less to play this character.\nResist +3 (Damage dealt to this character is reduced by 3.)",
  cost: 9,
  strength: 5,
  willpower: 5,
  lore: 3,
  cardNumber: 182,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ea7fa748b4cca0af4bd518d76cb8babd68cdf40c",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { resistAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const namaariResoluteDaughter: LorcanitoCharacterCard = {
//   id: "p4n",
//   name: "Namaari",
//   title: "Resolute Daughter",
//   characteristics: ["storyborn", "villain", "princess"],
//   text: "**I DON’T HAVE ANY OTHER CHOICE** For each opposing character banished in a challenge this turn, you pay 2 {I} less to play this character. **Resist** +3 _(Damage dealt to this character is reduced by 3.)_",
//   type: "character",
//   abilities: [resistAbility(3)],
//   colors: ["steel"],
//   cost: 9,
//   strength: 5,
//   willpower: 5,
//   lore: 3,
//   illustrator: "Jenna Gray",
//   number: 182,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561972,
//   },
//   rarity: "rare",
// };
//
