import type { CharacterCard } from "@tcg/lorcana-types";

export const emilyQuackfasterLevelheadedLibrarian: CharacterCard = {
  id: "1nf",
  cardType: "character",
  name: "Emily Quackfaster",
  version: "Level-Headed Librarian",
  fullName: "Emily Quackfaster - Level-Headed Librarian",
  inkType: ["emerald"],
  franchise: "Ducktales",
  set: "010",
  text: "RECOMMENDED READING When you play this character, you may put the top card of your deck facedown under one of your characters or locations with Boost.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 80,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d62534b6bec2afebd7181b6e944da36e0e47f5eb",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { boostTargetCharOrLocationWithBoostAbility } from "@lorcanito/lorcana-engine/abilities/boostAbility";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const emilyQuackfasterLevelheadedLibrarian: LorcanitoCharacterCard = {
//   id: "hth",
//   name: "Emily Quackfaster",
//   title: "Level-Headed Librarian",
//   characteristics: ["storyborn", "ally"],
//   text: "RECOMMENDED READING When you play this character, you may put the top card of your deck facedown under one of your characters or locations with Boost.",
//   type: "character",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 2,
//   strength: 2,
//   willpower: 2,
//   illustrator: "Mario Oscar Gabriele",
//   number: 80,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659451,
//   },
//   rarity: "uncommon",
//   lore: 1,
//   abilities: [
//     whenYouPlayThis({
//       name: "RECOMMENDED READING",
//       text: "When you play this character, you may put the top card of your deck facedown under one of your characters or locations with Boost.",
//       optional: true,
//       effects: [boostTargetCharOrLocationWithBoostAbility],
//     }),
//   ],
// };
//
