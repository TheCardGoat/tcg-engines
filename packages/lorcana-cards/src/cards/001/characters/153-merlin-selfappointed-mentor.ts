import type { CharacterCard } from "@tcg/lorcana-types";

export const merlinSelfappointedMentor: CharacterCard = {
  id: "y4v",
  cardType: "character",
  name: "Merlin",
  version: "Self-Appointed Mentor",
  fullName: "Merlin - Self-Appointed Mentor",
  inkType: ["sapphire"],
  franchise: "Disney",
  set: "001",
  text: "**Support** _(Whenever this character quests, you\u0003 may add their {S} to another chosen character‘s {S} this turn.)",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 153,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [],
  classifications: ["Dreamborn", "Sorcerer", "Mentor"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const merlinSelfAppointmentMentor: LorcanitoCharacterCard = {
//   id: "y4v",
//
//   name: "Merlin",
//   title: "Self-Appointed Mentor",
//   characteristics: ["dreamborn", "sorcerer", "mentor"],
//   text: "**Support** _(Whenever this character quests, you\u0003 may add their {S} to another chosen character‘s {S} this turn.)",
//   type: "character",
//   abilities: [supportAbility],
//   flavour: "What a mess! What a medieval muddle! We'll have to modernize it.",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 4,
//   strength: 3,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Dave Beauchene",
//   number: 153,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 503354,
//   },
//   rarity: "common",
// };
//
