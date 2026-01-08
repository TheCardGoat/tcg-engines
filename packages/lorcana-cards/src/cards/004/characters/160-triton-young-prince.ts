import type { CharacterCard } from "@tcg/lorcana-types";

export const tritonYoungPrince: CharacterCard = {
  id: "si2",
  cardType: "character",
  name: "Triton",
  version: "Young Prince",
  fullName: "Triton - Young Prince",
  inkType: ["sapphire"],
  franchise: "Little Mermaid",
  set: "004",
  text: "SUPERIOR SWIMMER During your turn, this character gains Evasive. (They can challenge characters with Evasive.)\nKEEPER OF ATLANTICA Whenever one of your locations is banished, you may put that card into your inkwell facedown and exerted.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 160,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "02da76ce172aef8ef2082d7b7a8bfd252dcefa0c",
  },
  abilities: [],
  classifications: ["Dreamborn", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   duringYourTurnGains,
//   evasiveAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { yourBanishedLocations } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenXIsBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { putThisCardIntoYourInkwellExerted } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const tritonYoungPrince: LorcanitoCharacterCard = {
//   id: "wlm",
//   name: "Triton",
//   title: "Young Prince",
//   characteristics: ["dreamborn", "prince"],
//   text: "**SUPERIOR SWIMMER** During your turn, this character gains **Evasive**. _(They can challenge characters with Evasive.)_\n\n\n**KEEPER OF ATLANTICA** Whenever one of your locations is banished, you may put that card into your inkwell facedown and exerted.",
//   type: "character",
//   abilities: [
//     {
//       type: "static",
//       ability: "gain-ability",
//       name: "Keeper Of Atlantica",
//       text: "Whenever one of your locations is banished, you may put that card into your inkwell facedown and exerted.",
//       target: yourBanishedLocations,
//       gainedAbility: whenXIsBanished({
//         name: "Keeper Of Atlantica",
//         text: "Whenever one of your locations is banished, you may put that card into your inkwell facedown and exerted.",
//         optional: true,
//         effects: [putThisCardIntoYourInkwellExerted],
//       }),
//     },
//     duringYourTurnGains(
//       "Superior Swimmer",
//       "During your turn, this character gains **Evasive**. _(They can challenge characters with Evasive.)_",
//       evasiveAbility,
//     ),
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 4,
//   strength: 3,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Malia Ewart",
//   number: 160,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550612,
//   },
//   rarity: "uncommon",
// };
//
