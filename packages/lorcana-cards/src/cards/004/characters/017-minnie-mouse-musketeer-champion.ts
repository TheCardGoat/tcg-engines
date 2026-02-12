import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseMusketeerChampion: CharacterCard = {
  abilities: [
    {
      id: "1kb-1",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "opponent",
          selector: "chosen",
          zones: ["play"],
        },
        type: "banish",
      },
      id: "1kb-2",
      name: "DRAMATIC ENTRANCE",
      text: "DRAMATIC ENTRANCE When you play this character, banish chosen opposing character with 5 {S} or more.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 17,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Musketeer"],
  cost: 5,
  externalIds: {
    ravensburger: "cafbe429486948b0c90695e0d88422c1815a0ad8",
  },
  fullName: "Minnie Mouse - Musketeer Champion",
  id: "1kb",
  inkType: ["amber"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Minnie Mouse",
  set: "004",
  strength: 1,
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nDRAMATIC ENTRANCE When you play this character, banish chosen opposing character with 5 {S} or more.",
  version: "Musketeer Champion",
  willpower: 5,
};
