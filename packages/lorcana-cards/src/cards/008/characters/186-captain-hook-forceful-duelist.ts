import type { CharacterCard } from "@tcg/lorcana-types";

export const captainHookForcefulDuelist: CharacterCard = {
  abilities: [
    {
      id: "bhv-1",
      keyword: "Challenger",
      text: "Challenger +2",
      type: "keyword",
      value: 2,
    },
  ],
  cardNumber: 186,
  cardType: "character",
  classifications: ["Dreamborn", "Villain", "Pirate", "Captain"],
  cost: 1,
  externalIds: {
    ravensburger: "296f4ed274c9b83418b64ea35bcc8ffc4a4a5dc3",
  },
  franchise: "Peter Pan",
  fullName: "Captain Hook - Forceful Duelist",
  id: "bhv",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  name: "Captain Hook",
  set: "008",
  strength: 1,
  text: "Challenger +2 (While challenging, this character gets +2 {S}.)",
  version: "Forceful Duelist",
  willpower: 2,
};
