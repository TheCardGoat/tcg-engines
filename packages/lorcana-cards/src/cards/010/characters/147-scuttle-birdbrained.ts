import type { CharacterCard } from "@tcg/lorcana";

export const scuttleBirdbrained: CharacterCard = {
  id: "13d",
  cardType: "character",
  name: "Scuttle",
  version: "Birdbrained",
  fullName: "Scuttle - Birdbrained",
  inkType: ["sapphire"],
  franchise: "Little Mermaid",
  set: "010",
  text: "Ward (Opponents can't choose this character except to challenge.)",
  cardNumber: "147",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    ravensburger: "8ded4e32f6390106d15d72e5aab8aa2ebd2b2963",
  },
  keywords: ["Ward"],
  abilities: [
    {
      id: "13da1",
      text: "Ward",
      type: "static",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};
