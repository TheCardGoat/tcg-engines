import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseCompassionateFriend: CharacterCard = {
  id: "g8h",
  cardType: "character",
  name: "Minnie Mouse",
  version: "Compassionate Friend",
  fullName: "Minnie Mouse - Compassionate Friend",
  inkType: ["amber"],
  set: "005",
  text: "PATCH THEM UP Whenever this character quests, you may remove up to 2 damage from chosen character.",
  cost: 4,
  strength: 1,
  willpower: 5,
  lore: 2,
  cardNumber: 24,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3a83ae70ab7cd55e39f3141ec55b6b9f7ac441d2",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const minnieMouseCompassionateFriend: LorcanitoCharacterCard = {
//   id: "our",
//   missingTestCase: true,
//   name: "Minnie Mouse",
//   title: "Compassionate Friend",
//   characteristics: ["hero", "storyborn"],
//   text: "**PATCH THEM UP** Whenever this character quests, you may remove up to 2 damage from chosen character.",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       name: "Patch them up",
//       text: "Whenever this character quests, you may remove up to 2 damage from chosen character.",
//       effects: [
//         {
//           type: "heal",
//           amount: 2,
//           upTo: true,
//           target: chosenCharacter,
//         },
//       ],
//     }),
//   ],
//   flavour: "Oh my! Is that part of the Illuminary? I have to go help!",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 4,
//   strength: 1,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Gonzalo Kenny",
//   number: 24,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561949,
//   },
//   rarity: "common",
// };
//
