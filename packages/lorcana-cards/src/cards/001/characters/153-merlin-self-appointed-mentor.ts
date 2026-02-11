import type { CharacterCard } from "@tcg/lorcana-types";

export const merlinSelfappointedMentor: CharacterCard = {
  abilities: [
    {
      id: "uii-1",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
  ],
  cardNumber: 153,
  cardType: "character",
  classifications: ["Dreamborn", "Mentor", "Sorcerer"],
  cost: 4,
  externalIds: {
    ravensburger: "6df9e37cf042bea283043a907feb840a22e7db90",
  },
  franchise: "Sword in the Stone",
  fullName: "Merlin - Self-Appointed Mentor",
  id: "uii",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  name: "Merlin",
  set: "001",
  strength: 3,
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  version: "Self-Appointed Mentor",
  willpower: 4,
};
