import type { CharacterCard } from "@tcg/lorcana-types";

export const patchPlayfulPup: CharacterCard = {
  id: "1x2",
  cardType: "character",
  name: "Patch",
  version: "Playful Pup",
  fullName: "Patch - Playful Pup",
  inkType: ["amber", "sapphire"],
  franchise: "101 Dalmatians",
  set: "008",
  text: "Ward (Opponents can't choose this character except to challenge.)\nPUPPY BARKING While you have another Puppy character in play, this character gets +1 {L}.",
  cost: 1,
  strength: 0,
  willpower: 2,
  lore: 1,
  cardNumber: 25,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f8f789eb2731caf4efdb21cc3438d0dc6b1ab4cf",
  },
  abilities: [],
  classifications: ["Storyborn", "Puppy"],
};
