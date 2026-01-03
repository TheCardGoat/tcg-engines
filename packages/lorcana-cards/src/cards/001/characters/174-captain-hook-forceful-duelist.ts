import type { CharacterCard } from "@tcg/lorcana-types";

export const CaptainHookForcefulDuelist: CharacterCard = {
  id: "uk5",
  cardType: "character",
  name: "Captain Hook",
  version: "Forceful Duelist",
  fullName: "Captain Hook - Forceful Duelist",
  inkType: ["steel"],
  franchise: "Disney",
  set: "001",
  text: "**Challenger** +2 (_While challenging, this character get +2 {S}._)",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 174,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "static",
      text: "**Challenger** +2 (_While challenging, this character get +2 {S}._)",
      id: "uk5-1",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
    },
  ],
  classifications: ["Dreamborn", "Villain", "Pirate", "Captain"],
};
