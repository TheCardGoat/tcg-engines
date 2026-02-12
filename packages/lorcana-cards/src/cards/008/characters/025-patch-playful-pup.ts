import type { CharacterCard } from "@tcg/lorcana-types";

export const patchPlayfulPup: CharacterCard = {
  abilities: [
    {
      id: "1x2-1",
      keyword: "Ward",
      text: "Ward",
      type: "keyword",
    },
    {
      effect: {
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1x2-2",
      text: "PUPPY BARKING While you have another Puppy character in play, this character gets +1 {L}.",
      type: "action",
    },
  ],
  cardNumber: 25,
  cardType: "character",
  classifications: ["Storyborn", "Puppy"],
  cost: 1,
  externalIds: {
    ravensburger: "f8f789eb2731caf4efdb21cc3438d0dc6b1ab4cf",
  },
  franchise: "101 Dalmatians",
  fullName: "Patch - Playful Pup",
  id: "1x2",
  inkType: ["amber", "sapphire"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Patch",
  set: "008",
  strength: 0,
  text: "Ward (Opponents can't choose this character except to challenge.)\nPUPPY BARKING While you have another Puppy character in play, this character gets +1 {L}.",
  version: "Playful Pup",
  willpower: 2,
};
