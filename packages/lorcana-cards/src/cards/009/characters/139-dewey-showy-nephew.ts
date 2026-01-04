import type { CharacterCard } from "@tcg/lorcana-types";

export const deweyShowyNephew: CharacterCard = {
  id: "32f",
  cardType: "character",
  name: "Dewey",
  version: "Showy Nephew",
  fullName: "Dewey - Showy Nephew",
  inkType: ["sapphire"],
  franchise: "Ducktales",
  set: "009",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 139,
  inkable: true,
  externalIds: {
    ravensburger: "0b0ddc6a36474b1503510c3a4c1a09e035e13baf",
  },
  abilities: [
    {
      id: "32f-1",
      text: "Support",
      type: "keyword",
      keyword: "Support",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};
