import type { CharacterCard } from "@tcg/lorcana-types";

export const jetsamRiffraff: CharacterCard = {
  abilities: [
    {
      id: "1py-1",
      keyword: "Ward",
      text: "Ward",
      type: "keyword",
    },
    {
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: "YOUR_CHARACTERS",
      },
      id: "1py-2",
      text: "EERIE PAIR Your characters named Flotsam gain Ward.",
      type: "action",
    },
  ],
  cardNumber: 76,
  cardType: "character",
  classifications: ["Dreamborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "df5150338f9402043e441bce48da10db7dde0b61",
  },
  franchise: "Little Mermaid",
  fullName: "Jetsam - Riffraff",
  id: "1py",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Jetsam",
  set: "003",
  strength: 2,
  text: "Ward (Opponents can't choose this character except to challenge.)\nEERIE PAIR Your characters named Flotsam gain Ward.",
  version: "Riffraff",
  willpower: 2,
};
