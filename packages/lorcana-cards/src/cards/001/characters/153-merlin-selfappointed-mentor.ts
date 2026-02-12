import type { CharacterCard } from "@tcg/lorcana-types";

export const merlinSelfappointedMentor: CharacterCard = {
  abilities: [],
  cardNumber: 153,
  cardType: "character",
  classifications: ["Dreamborn", "Sorcerer", "Mentor"],
  cost: 4,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Merlin - Self-Appointed Mentor",
  id: "y4v",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  name: "Merlin",
  set: "001",
  strength: 3,
  text: "**Support** _(Whenever this character quests, you\u0003 may add their {S} to another chosen character‘s {S} this turn.)",
  version: "Self-Appointed Mentor",
  willpower: 4,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const merlinSelfAppointmentMentor: LorcanitoCharacterCard = {
//   Id: "y4v",
//
//   Name: "Merlin",
//   Title: "Self-Appointed Mentor",
//   Characteristics: ["dreamborn", "sorcerer", "mentor"],
//   Text: "**Support** _(Whenever this character quests, you\u0003 may add their {S} to another chosen character‘s {S} this turn.)",
//   Type: "character",
//   Abilities: [supportAbility],
//   Flavour: "What a mess! What a medieval muddle! We'll have to modernize it.",
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 4,
//   Strength: 3,
//   Willpower: 4,
//   Lore: 1,
//   Illustrator: "Dave Beauchene",
//   Number: 153,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 503354,
//   },
//   Rarity: "common",
// };
//
