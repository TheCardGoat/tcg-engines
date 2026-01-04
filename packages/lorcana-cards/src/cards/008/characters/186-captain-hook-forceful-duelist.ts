import type { CharacterCard } from "@tcg/lorcana-types";

export const captainHookForcefulDuelist: CharacterCard = {
  id: "bhv",
  cardType: "character",
  name: "Captain Hook",
  version: "Forceful Duelist",
  fullName: "Captain Hook - Forceful Duelist",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "008",
  text: "Challenger +2 (While challenging, this character gets +2 {S}.)",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 186,
  inkable: true,
  externalIds: {
    ravensburger: "296f4ed274c9b83418b64ea35bcc8ffc4a4a5dc3",
  },
  abilities: [
    {
      id: "bhv-1",
      type: "keyword",
      keyword: "Challenger",
      value: 2,
    },
  ],
  classifications: ["Dreamborn", "Villain", "Pirate", "Captain"],
};
