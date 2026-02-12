import type { CharacterCard } from "@tcg/lorcana-types";

export const flashRecordsSpecialist: CharacterCard = {
  abilities: [
    {
      effect: {
        restriction: "enters-play-exerted",
        target: "SELF",
        type: "restriction",
      },
      id: "1ds-1",
      text: "HOLD... YOUR HORSES This character enters play exerted.",
      type: "static",
    },
  ],
  cardNumber: 14,
  cardType: "character",
  classifications: ["Dreamborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "b370498df5e21a7fdb83d831c668be4e04b3bb95",
  },
  franchise: "Zootropolis",
  fullName: "Flash - Records Specialist",
  id: "1ds",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingImplementation: true,
  missingTests: true,
  name: "Flash",
  set: "010",
  strength: 3,
  text: "HOLD... YOUR HORSES This character enters play exerted.\nDEEP RESEARCH Whenever this character quests, you may give chosen Detective character +2 {S} this turn.",
  version: "Records Specialist",
  willpower: 4,
};
