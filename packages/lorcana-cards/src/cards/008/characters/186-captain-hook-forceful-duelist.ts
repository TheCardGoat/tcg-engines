import type { CharacterCard } from "@tcg/lorcana";

export const captainHookForcefulDuelist: CharacterCard = {
  id: "bhv",
  cardType: "character",
  name: "Captain Hook",
  version: "Forceful Duelist",
  fullName: "Captain Hook - Forceful Duelist",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "008",
  text: "Challenger +2 (While challenging, this character gets +2.)",
  cardNumber: "186",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: false,
  externalIds: {
    ravensburger: "296f4ed274c9b83418b64ea35bcc8ffc4a4a5dc3",
  },
  keywords: [
    {
      type: "Challenger",
      value: 2,
    },
  ],
  abilities: [
    {
      id: "bhv-ability-1",
      text: "Challenger +2 (While challenging, this character gets +2.)",
      type: "static",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Pirate", "Captain"],
};
