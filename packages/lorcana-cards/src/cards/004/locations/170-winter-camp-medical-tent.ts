import type { LocationCard } from "@tcg/lorcana-types";

export const winterCampMedicalTent: LocationCard = {
  id: "129",
  cardType: "location",
  name: "Winter Camp",
  version: "Medical Tent",
  fullName: "Winter Camp - Medical Tent",
  inkType: ["sapphire"],
  franchise: "Mulan",
  set: "004",
  text: "HELP THE WOUNDED Whenever a character quests while here, remove up to 2 damage from them. If they're a Hero character, remove up to 4 damage instead.",
  cost: 3,
  moveCost: 1,
  lore: 0,
  cardNumber: 170,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8a5ad6651326a91ac526f3f47fc3888894212935",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverACharacterQuestsWhileHere } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { healEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const winterCampMedicalTent: LorcanitoLocationCard = {
//   id: "ppi",
//   missingTestCase: true,
//   name: "Winter Camp",
//   title: "Medical Tent",
//   characteristics: ["location"],
//   text: "**HELP THE WOUNDED** Whenever a character quests while here, remove up to 2 damage from them. If they're a Hero character, remove up to 4 damage instead.",
//   type: "location",
//   abilities: [
//     wheneverACharacterQuestsWhileHere({
//       name: "Help the Wounded",
//       text: "Whenever a character quests while here, remove up to 2 damage from them. If they're a Hero character, remove up to 4 damage instead.",
//       effects: [healEffect(2, thisCharacter, undefined, true)],
//     }),
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 3,
//   moveCost: 1,
//   willpower: 8,
//   lore: 1,
//   illustrator: "Elodie Mondoloni",
//   number: 170,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550616,
//   },
//   rarity: "common",
// };
//
