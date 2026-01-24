import type { CharacterCard } from "@tcg/lorcana-types";

export const enchantressUnexpectedJudge: CharacterCard = {
  id: "mk4",
  cardType: "character",
  name: "Enchantress",
  version: "Unexpected Judge",
  fullName: "Enchantress - Unexpected Judge",
  inkType: ["emerald"],
  franchise: "Beauty and the Beast",
  set: "009",
  text: "TRUE FORM While being challenged, this character gets +2 {S}.",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 2,
  cardNumber: 81,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "514d881921a9208b5a264935feee3bf3fd6b18f7",
  },
  abilities: [
    {
      id: "mk4-1",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
      text: "TRUE FORM While being challenged, this character gets +2 {S}.",
    },
  ],
  classifications: ["Dreamborn", "Sorcerer"],
};
