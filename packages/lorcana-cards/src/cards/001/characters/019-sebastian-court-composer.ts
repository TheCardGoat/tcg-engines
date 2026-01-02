import type { CharacterCard } from "@tcg/lorcana-types";

export const sebastianCourtComposer: CharacterCard = {
  id: "8rz",
  cardType: "character",
  name: "Sebastian",
  version: "Court Composer",
  fullName: "Sebastian - Court Composer",
  inkType: ["amber"],
  franchise: "Little Mermaid",
  set: "001",
  text: "Singer 4 (This character counts as cost 4 to sing songs.)",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 19,
  inkable: true,
  externalIds: {
    ravensburger: "1fa28a7f4b2398c8cc72ea121b01ac0cccdda582",
  },
  abilities: [
    {
      id: "8rz-1",
      text: "Singer 4",
      type: "keyword",
      keyword: "Singer",
      value: 4,
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
