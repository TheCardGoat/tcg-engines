import type { CharacterCard } from "@tcg/lorcana-types";

export const theTroubadourMusicalNarrator: CharacterCard = {
  abilities: [
    {
      id: "1is-1",
      keyword: "Resist",
      text: "Resist +1",
      type: "keyword",
      value: 1,
    },
    {
      id: "1is-2",
      keyword: "Singer",
      text: "Singer 4",
      type: "keyword",
      value: 4,
    },
  ],
  cardNumber: 11,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "c57710fd5e34103000a17c6eedbbbdf775ab07ec",
  },
  fullName: "The Troubadour - Musical Narrator",
  id: "1is",
  inkType: ["amber", "steel"],
  inkable: true,
  lore: 1,
  name: "The Troubadour",
  set: "007",
  strength: 1,
  text: "Resist +1 (Damage dealt to this character is reduced by 1.)\nSinger 4 (This character counts as cost 4 to sing songs.)",
  version: "Musical Narrator",
  willpower: 3,
};
