import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseMusicalArtist: CharacterCard = {
  abilities: [
    {
      id: "egy-1",
      keyword: "Singer",
      text: "Singer 3",
      type: "keyword",
      value: 3,
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 2,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "remove-damage",
          upTo: true,
        },
        type: "optional",
      },
      id: "egy-2",
      name: "ENTOURAGE",
      text: "ENTOURAGE Whenever you play a character with Bodyguard, you may remove up to 2 damage from chosen character.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 9,
  cardType: "character",
  classifications: ["Dreamborn", "Hero"],
  cost: 2,
  externalIds: {
    ravensburger: "3427600e893c3a7a98bb9644ed1a9cbcdf7fd2da",
  },
  fullName: "Minnie Mouse - Musical Artist",
  id: "egy",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Minnie Mouse",
  set: "003",
  strength: 1,
  text: "Singer 3 (This character counts as cost 3 to sing songs.)\nENTOURAGE Whenever you play a character with Bodyguard, you may remove up to 2 damage from chosen character.",
  version: "Musical Artist",
  willpower: 3,
};
