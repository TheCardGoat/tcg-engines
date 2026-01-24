import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseMusicalArtist: CharacterCard = {
  id: "egy",
  cardType: "character",
  name: "Minnie Mouse",
  version: "Musical Artist",
  fullName: "Minnie Mouse - Musical Artist",
  inkType: ["amber"],
  set: "003",
  text: "Singer 3 (This character counts as cost 3 to sing songs.)\nENTOURAGE Whenever you play a character with Bodyguard, you may remove up to 2 damage from chosen character.",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 9,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3427600e893c3a7a98bb9644ed1a9cbcdf7fd2da",
  },
  abilities: [
    {
      id: "egy-1",
      type: "keyword",
      keyword: "Singer",
      value: 3,
      text: "Singer 3",
    },
    {
      id: "egy-2",
      type: "triggered",
      name: "ENTOURAGE",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "character",
        },
      },
      effect: {
        type: "optional",
        effect: {
          type: "remove-damage",
          amount: 2,
          upTo: true,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "ENTOURAGE Whenever you play a character with Bodyguard, you may remove up to 2 damage from chosen character.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
};
