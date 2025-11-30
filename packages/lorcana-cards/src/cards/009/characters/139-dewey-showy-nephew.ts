import type { CharacterCard } from "@tcg/lorcana";

export const deweyShowyNephew: CharacterCard = {
  id: "32f",
  cardType: "character",
  name: "Dewey",
  version: "Showy Nephew",
  fullName: "Dewey - Showy Nephew",
  inkType: ["sapphire"],
  franchise: "Ducktales",
  set: "009",
  text: "Support (Whenever this character quests, you may add their to another chosen character's this turn.)",
  cardNumber: "139",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    ravensburger: "0b0ddc6a36474b1503510c3a4c1a09e035e13baf",
  },
  keywords: ["Support"],
  abilities: [
    {
      id: "32fa1",
      text: "Support",
      type: "static",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};
