import type { CharacterCard } from "@tcg/lorcana-types";

export const princeNaveenUkulelePlayer: CharacterCard = {
  abilities: [
    {
      id: "v3r-1",
      keyword: "Singer",
      text: "Singer 6",
      type: "keyword",
      value: 6,
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          cost: "free",
          costRestriction: {
            comparison: "less-or-equal",
            value: 6,
          },
          from: "hand",
          type: "play-card",
        },
        type: "optional",
      },
      id: "v3r-2",
      text: "IT'S BEAUTIFUL, NO? When you play this character, you may play a song with cost 6 or less for free.",
      type: "action",
    },
  ],
  cardNumber: 3,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Prince"],
  cost: 4,
  externalIds: {
    ravensburger: "7019f88f23a40f374d0cc8e7cbb8cb18fd60de3a",
  },
  franchise: "Princess and the Frog",
  fullName: "Prince Naveen - Ukulele Player",
  id: "v3r",
  inkType: ["amber"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Prince Naveen",
  set: "005",
  strength: 3,
  text: "Singer 6 (This character counts as cost 6 to sing songs.)\nIT'S BEAUTIFUL, NO? When you play this character, you may play a song with cost 6 or less for free.",
  version: "Ukulele Player",
  willpower: 3,
};
