import type { CharacterCard } from "@tcg/lorcana-types";

export const tinkerBellMostHelpful: CharacterCard = {
  id: "ysx",
  cardType: "character",
  name: "Tinker Bell",
  version: "Most Helpful",
  fullName: "Tinker Bell - Most Helpful",
  inkType: ["emerald"],
  franchise: "Peter Pan",
  set: "009",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nPIXIE DUST When you play this character, chosen character gains Evasive this turn.",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 88,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7d6f88911941e9ab84662a1acc5938a3572d710b",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Fairy"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { tinkerBellMostHelpful as ogTinkerBellMostHelpful } from "@lorcanito/lorcana-engine/cards/001/characters/093-tinker-bell-most-helpful";
//
// export const tinkerBellMostHelpful: LorcanitoCharacterCard = {
//   ...ogTinkerBellMostHelpful,
//   id: "rxt",
//   reprints: [ogTinkerBellMostHelpful.id],
//   number: 88,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650028,
//   },
// };
//
