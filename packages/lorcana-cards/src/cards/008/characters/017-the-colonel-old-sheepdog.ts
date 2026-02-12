import type { CharacterCard } from "@tcg/lorcana-types";

export const theColonelOldSheepdog: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
      id: "1r3-1",
      text: "WE'VE GOT 'EM OUTNUMBERED While you have 3 or more Puppy characters in play, this character gets +2 {S} and +2 {L}.",
      type: "action",
    },
  ],
  cardNumber: 17,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 5,
  externalIds: {
    ravensburger: "e3655a27dae1da92cf77d60d195ea2b3b71bc4cd",
  },
  franchise: "101 Dalmatians",
  fullName: "The Colonel - Old Sheepdog",
  id: "1r3",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "The Colonel",
  set: "008",
  strength: 3,
  text: "WE'VE GOT 'EM OUTNUMBERED While you have 3 or more Puppy characters in play, this character gets +2 {S} and +2 {L}.",
  version: "Old Sheepdog",
  willpower: 6,
};
