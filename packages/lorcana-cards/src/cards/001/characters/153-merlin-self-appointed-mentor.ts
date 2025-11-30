import type { CharacterCard } from "@tcg/lorcana";

export const merlinSelfappointedMentor: CharacterCard = {
  id: "uii",
  cardType: "character",
  name: "Merlin",
  version: "Self-Appointed Mentor",
  fullName: "Merlin - Self-Appointed Mentor",
  inkType: ["sapphire"],
  franchise: "Sword in the Stone",
  set: "001",
  text: "Support (Whenever this character quests, you may add their to another chosen character's this turn.)",
  cardNumber: "153",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "6df9e37cf042bea283043a907feb840a22e7db90",
  },
  keywords: ["Support"],
  abilities: [
    {
      id: "uiia1",
      text: "Support",
      type: "static",
    },
  ],
  classifications: ["Dreamborn", "Mentor", "Sorcerer"],
};
