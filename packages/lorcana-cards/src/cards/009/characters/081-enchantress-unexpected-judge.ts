import type { CharacterCard } from "@tcg/lorcana-types";

export const enchantressUnexpectedJudge: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
      id: "mk4-1",
      text: "TRUE FORM While being challenged, this character gets +2 {S}.",
      type: "action",
    },
  ],
  cardNumber: 81,
  cardType: "character",
  classifications: ["Dreamborn", "Sorcerer"],
  cost: 2,
  externalIds: {
    ravensburger: "514d881921a9208b5a264935feee3bf3fd6b18f7",
  },
  franchise: "Beauty and the Beast",
  fullName: "Enchantress - Unexpected Judge",
  id: "mk4",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Enchantress",
  set: "009",
  strength: 1,
  text: "TRUE FORM While being challenged, this character gets +2 {S}.",
  version: "Unexpected Judge",
  willpower: 1,
};
