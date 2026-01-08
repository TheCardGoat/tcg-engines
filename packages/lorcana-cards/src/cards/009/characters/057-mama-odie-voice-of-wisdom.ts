import type { CharacterCard } from "@tcg/lorcana-types";

export const mamaOdieVoiceOfWisdom: CharacterCard = {
  id: "w2y",
  cardType: "character",
  name: "Mama Odie",
  version: "Voice of Wisdom",
  fullName: "Mama Odie - Voice of Wisdom",
  inkType: ["amethyst"],
  franchise: "Princess and the Frog",
  set: "009",
  text: "LISTEN TO YOUR MAMA NOW Whenever this character quests, you may move up to 2 damage counters from chosen character to chosen opposing character.",
  cost: 6,
  strength: 3,
  willpower: 6,
  lore: 2,
  cardNumber: 57,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "73a02488dd4a721f27d76641765f67896fd2a61b",
  },
  abilities: [],
  classifications: ["Dreamborn", "Ally", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { mamaOdieVoiceOfWisdom as mamaOdieVoiceOfWisdomAsOrig } from "@lorcanito/lorcana-engine/cards/003/characters/052-mama-odie-voice-of-wisdom";
//
// export const mamaOdieVoiceOfWisdom: LorcanitoCharacterCard = {
//   ...mamaOdieVoiceOfWisdomAsOrig,
//   id: "ozw",
//   reprints: [mamaOdieVoiceOfWisdomAsOrig.id],
//   number: 57,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650001,
//   },
// };
//
