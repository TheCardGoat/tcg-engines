import type { CharacterCard } from "@tcg/lorcana-types/cards/card-types";

export const princeEric: CharacterCard = {
  id: "omx",
  cardType: "character",
  name: "Prince Eric",
  version: "Dashing and Brave",
  fullName: "Prince Eric - Dashing and Brave",
  inkType: ["steel"],
  franchise: "The Little Mermaid",
  set: "001",
  text: "**Challenger** +2 _(While challenging, this character gets +2 {S}.)_",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 187,
  inkable: true,
  rarity: "common",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 508933,
  },
  classifications: ["Hero", "Storyborn", "Prince"],
  abilities: [
    {
      type: "static",
      effect: {
        type: "restriction",
        restriction: "cant-sing",
        target: "SELF",
      },
      id: "omx-1",
      text: "**Challenger** +2 (_When challenging, this character get +2 {S}._)",
    },
  ],
};
