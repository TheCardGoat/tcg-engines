import type { CharacterCard } from "@tcg/lorcana-types";

export const herculesBabyDemigod: CharacterCard = {
  id: "844",
  cardType: "character",
  name: "Hercules",
  version: "Baby Demigod",
  fullName: "Hercules - Baby Demigod",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "006",
  text: "Ward (Opponents can't choose this character except to challenge.)\nSTRONG LIKE HIS DAD 3 {I} - Deal 1 damage to chosen damaged character.",
  cost: 6,
  strength: 6,
  willpower: 3,
  lore: 2,
  cardNumber: 86,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1d3e9a6a745129558b1f73e99dcf845eebef5469",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { chosenDamagedCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const herculesBabyDemigod: LorcanitoCharacterCard = {
//   id: "bsk",
//   missingTestCase: true,
//   name: "Hercules",
//   title: "Baby Demigod",
//   characteristics: ["storyborn", "hero", "prince"],
//   text: "Ward (Opponents can't choose this character except to challenge.)\nSTRONG LIKE HIS DAD 3 {I} - Deal 1 damage to chosen damaged character.",
//   type: "character",
//   abilities: [
//     wardAbility,
//     {
//       type: "activated",
//       costs: [{ type: "ink", amount: 3 }],
//       effects: [dealDamageEffect(1, chosenDamagedCharacter)],
//     },
//   ],
//   inkwell: false,
//   colors: ["emerald"],
//   cost: 6,
//   strength: 6,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Kipik",
//   number: 86,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 588071,
//   },
//   rarity: "legendary",
// };
//
