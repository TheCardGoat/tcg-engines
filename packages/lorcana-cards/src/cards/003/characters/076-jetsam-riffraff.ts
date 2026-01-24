import type { CharacterCard } from "@tcg/lorcana-types";

export const jetsamRiffraff: CharacterCard = {
  id: "1py",
  cardType: "character",
  name: "Jetsam",
  version: "Riffraff",
  fullName: "Jetsam - Riffraff",
  inkType: ["emerald"],
  franchise: "Little Mermaid",
  set: "003",
  text: "Ward (Opponents can't choose this character except to challenge.)\nEERIE PAIR Your characters named Flotsam gain Ward.",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 2,
  cardNumber: 76,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "df5150338f9402043e441bce48da10db7dde0b61",
  },
  abilities: [
    {
      id: "1py-1",
      type: "keyword",
      keyword: "Ward",
      text: "Ward",
    },
    {
      id: "1py-2",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: "YOUR_CHARACTERS",
      },
      text: "EERIE PAIR Your characters named Flotsam gain Ward.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};
