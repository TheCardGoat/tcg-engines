import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMousePlayfulSorcerer: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "14q-1",
      keyword: "Shift",
      text: "Shift 3",
      type: "keyword",
    },
    {
      id: "14q-2",
      keyword: "Resist",
      text: "Resist +1",
      type: "keyword",
      value: 1,
    },
  ],
  cardNumber: 187,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Sorcerer"],
  cost: 5,
  externalIds: {
    ravensburger: "92ca31b3dd2f356cf1cd1d09a4c9d9744440282d",
  },
  franchise: "Fantasia",
  fullName: "Mickey Mouse - Playful Sorcerer",
  id: "14q",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingImplementation: true,
  missingTests: true,
  name: "Mickey Mouse",
  set: "004",
  strength: 3,
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Mickey Mouse.)\nResist +1 (Damage dealt to this character is reduced by 1.)\nSWEEP AWAY When you play this character, deal damage to chosen character equal to the number of Broom characters you have in play.",
  version: "Playful Sorcerer",
  willpower: 4,
};
