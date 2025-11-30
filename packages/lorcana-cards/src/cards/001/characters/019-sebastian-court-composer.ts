import type { CharacterCard } from "@tcg/lorcana";

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
  cardNumber: "019",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: false,
  externalIds: {
    ravensburger: "1fa28a7f4b2398c8cc72ea121b01ac0cccdda582",
  },
  keywords: [
    {
      type: "Singer",
      value: 4,
    },
  ],
  abilities: [
    {
      id: "8rz-ability-1",
      text: "Singer 4 (This character counts as cost 4 to sing songs.)",
      type: "static",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
