import type { CharacterCard } from "@tcg/lorcana-types";

export const tianaNaturalTalent: CharacterCard = {
  abilities: [
    {
      id: "tr1-1",
      keyword: "Singer",
      text: "Singer 6",
      type: "keyword",
      value: 6,
    },
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -1,
        target: "CHOSEN_CHARACTER",
      },
      id: "tr1-2",
      name: "CAPTIVATING MELODY",
      text: "CAPTIVATING MELODY Whenever you play a song, each opposing character gets -1 {S} until the start of your next turn.",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "action",
        },
      },
      type: "triggered",
    },
  ],
  cardNumber: 9,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 4,
  externalIds: {
    ravensburger: "6b3948392fa9a30d9b83f0ea009651dc50ea2aae",
  },
  franchise: "Princess and the Frog",
  fullName: "Tiana - Natural Talent",
  id: "tr1",
  inkType: ["amber"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Tiana",
  set: "008",
  strength: 2,
  text: "Singer 6 (This character counts as cost 6 to sing songs.)\nCAPTIVATING MELODY Whenever you play a song, each opposing character gets -1 {S} until the start of your next turn.",
  version: "Natural Talent",
  willpower: 4,
};
