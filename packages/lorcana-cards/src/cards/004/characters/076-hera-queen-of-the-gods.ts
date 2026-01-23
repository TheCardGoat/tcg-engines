import type { CharacterCard } from "@tcg/lorcana-types";

export const heraQueenOfTheGods: CharacterCard = {
  id: "149",
  cardType: "character",
  name: "Hera",
  version: "Queen of the Gods",
  fullName: "Hera - Queen of the Gods",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "004",
  text: "Ward (Opponents can't choose this character except to challenge.)\nPROTECTIVE GODDESS Your characters named Zeus gain Ward.\nYOU'RE A TRUE HERO Your characters named Hercules gain Evasive. (Only characters with Evasive can challenge them.)",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 2,
  cardNumber: 76,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "908c1d368aae7b1e8b09740cb282e4eae501ef42",
  },
  abilities: [],
  classifications: ["Storyborn", "Queen", "Deity"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   evasiveAbility,
//   wardAbility,
//   yourOtherCharactersWithGain,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const heraQueenOfTheGods: LorcanitoCharacterCard = {
//   id: "qp0",
//   name: "Hera",
//   title: "Queen of the Gods",
//   characteristics: ["queen", "storyborn", "deity"],
//   text: "**Ward** _(Opponents can't choose this character except to challenge.)_\n\n\n**PROTECTIVE GODDESS** Your characters named Zeus gain **Ward**.\n\n\n**YOU'RE A TRUE HERO** Your characters named Hercules gain **Evasive**. _(Only characters with Evasive can challenge them.)_",
//   type: "character",
//   abilities: [
//     wardAbility,
//     yourOtherCharactersWithGain({
//       name: "Protective Goddess",
//       text: "Your characters named Zeus gain **Ward**.",
//       gainedAbility: wardAbility,
//       filter: {
//         filter: "attribute",
//         value: "name",
//         comparison: { operator: "eq", value: "Zeus" },
//       },
//     }),
//     yourOtherCharactersWithGain({
//       name: "You're a True Hero",
//       text: "Your characters named Hercules gain **Evasive**. _(Only characters with Evasive can challenge them.)_",
//       gainedAbility: evasiveAbility,
//       filter: {
//         filter: "attribute",
//         value: "name",
//         comparison: { operator: "eq", value: "Hercules" },
//       },
//     }),
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   strength: 1,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Raquel Villanueva",
//   number: 76,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 549668,
//   },
//   rarity: "rare",
// };
//
