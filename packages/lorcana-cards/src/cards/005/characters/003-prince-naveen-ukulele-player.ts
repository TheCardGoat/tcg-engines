import type { CharacterCard } from "@tcg/lorcana-types";

export const princeNaveenUkulelePlayer: CharacterCard = {
  id: "v3r",
  cardType: "character",
  name: "Prince Naveen",
  version: "Ukulele Player",
  fullName: "Prince Naveen - Ukulele Player",
  inkType: ["amber"],
  franchise: "Princess and the Frog",
  set: "005",
  text: "Singer 6 (This character counts as cost 6 to sing songs.)\nIT'S BEAUTIFUL, NO? When you play this character, you may play a song with cost 6 or less for free.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 3,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "7019f88f23a40f374d0cc8e7cbb8cb18fd60de3a",
  },
  abilities: [
    {
      id: "v3r-1",
      type: "keyword",
      keyword: "Singer",
      value: 6,
      text: "Singer 6",
    },
    {
      id: "v3r-2",
      type: "action",
      effect: {
        type: "optional",
        effect: {
          type: "play-card",
          from: "hand",
          cost: "free",
          costRestriction: {
            comparison: "less-or-equal",
            value: 6,
          },
        },
        chooser: "CONTROLLER",
      },
      text: "IT'S BEAUTIFUL, NO? When you play this character, you may play a song with cost 6 or less for free.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
};
