import type { CharacterCard } from "@tcg/lorcana-types";

export const razoulPalaceGuard: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
      id: "1xc-1",
      text: "LOOKY HERE While this character has no damage, he gets +2 {S}.",
      type: "static",
    },
  ],
  cardNumber: 188,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Captain"],
  cost: 2,
  externalIds: {
    ravensburger: "f8dd4eca93b566669177d2b20df6caf61a1b91ea",
  },
  franchise: "Aladdin",
  fullName: "Razoul - Palace Guard",
  id: "1xc",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Razoul",
  set: "003",
  strength: 1,
  text: "LOOKY HERE While this character has no damage, he gets +2 {S}.",
  version: "Palace Guard",
  willpower: 3,
};
