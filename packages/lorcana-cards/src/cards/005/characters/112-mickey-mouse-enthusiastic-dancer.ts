import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseEnthusiasticDancer: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
      id: "18m-1",
      text: "PERFECT PARTNERS While you have a character named Minnie Mouse in play, this character gets +2 {S}.",
      type: "action",
    },
  ],
  cardNumber: 112,
  cardType: "character",
  classifications: ["Dreamborn", "Hero"],
  cost: 4,
  externalIds: {
    ravensburger: "a0cc1cbe850b058691e14ae966fb8a3cf4055116",
  },
  fullName: "Mickey Mouse - Enthusiastic Dancer",
  id: "18m",
  inkType: ["ruby"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Mickey Mouse",
  set: "005",
  strength: 2,
  text: "PERFECT PARTNERS While you have a character named Minnie Mouse in play, this character gets +2 {S}.",
  version: "Enthusiastic Dancer",
  willpower: 4,
};
