import type { CharacterCard } from "@tcg/lorcana-types";

export const tianaNaturalTalent: CharacterCard = {
  id: "tr1",
  cardType: "character",
  name: "Tiana",
  version: "Natural Talent",
  fullName: "Tiana - Natural Talent",
  inkType: ["amber"],
  franchise: "Princess and the Frog",
  set: "008",
  text: "Singer 6 (This character counts as cost 6 to sing songs.)\nCAPTIVATING MELODY Whenever you play a song, each opposing character gets -1 {S} until the start of your next turn.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 9,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "6b3948392fa9a30d9b83f0ea009651dc50ea2aae",
  },
  abilities: [
    {
      id: "tr1-1",
      type: "keyword",
      keyword: "Singer",
      value: 6,
      text: "Singer 6",
    },
    {
      id: "tr1-2",
      type: "triggered",
      name: "CAPTIVATING MELODY",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "action",
        },
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -1,
        target: "CHOSEN_CHARACTER",
      },
      text: "CAPTIVATING MELODY Whenever you play a song, each opposing character gets -1 {S} until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};
