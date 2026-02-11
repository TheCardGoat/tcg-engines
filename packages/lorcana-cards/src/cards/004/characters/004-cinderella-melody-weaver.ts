import type { CharacterCard } from "@tcg/lorcana-types";

export const cinderellaMelodyWeaver: CharacterCard = {
  abilities: [
    {
      id: "juj-1",
      keyword: "Singer",
      text: "Singer 9",
      type: "keyword",
      value: 9,
    },
    {
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
      id: "juj-2",
      name: "BEAUTIFUL VOICE",
      text: "BEAUTIFUL VOICE Whenever this character sings a song, your other Princess characters get +1 {L} this turn.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 4,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Princess"],
  cost: 5,
  externalIds: {
    ravensburger: "4788d25c0a43283f16dc66d4840c94239e9cdbda",
  },
  franchise: "Cinderella",
  fullName: "Cinderella - Melody Weaver",
  id: "juj",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Cinderella",
  set: "004",
  strength: 1,
  text: "Singer 9 (This character counts as cost 9 to sing songs.)\nBEAUTIFUL VOICE Whenever this character sings a song, your other Princess characters get +1 {L} this turn.",
  version: "Melody Weaver",
  willpower: 5,
};
