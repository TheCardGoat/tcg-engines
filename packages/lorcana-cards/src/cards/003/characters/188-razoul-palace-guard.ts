import type { CharacterCard } from "@tcg/lorcana-types";

export const razoulPalaceGuard: CharacterCard = {
  id: "1xc",
  cardType: "character",
  name: "Razoul",
  version: "Palace Guard",
  fullName: "Razoul - Palace Guard",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "003",
  text: "LOOKY HERE While this character has no damage, he gets +2 {S}.",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 188,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f8dd4eca93b566669177d2b20df6caf61a1b91ea",
  },
  abilities: [
    {
      id: "1xc-1",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
      text: "LOOKY HERE While this character has no damage, he gets +2 {S}.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Captain"],
};
