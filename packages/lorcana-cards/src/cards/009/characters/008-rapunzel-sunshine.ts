import type { CharacterCard } from "@tcg/lorcana-types";

export const rapunzelSunshine: CharacterCard = {
  id: "zai",
  cardType: "character",
  name: "Rapunzel",
  version: "Sunshine",
  fullName: "Rapunzel - Sunshine",
  inkType: ["amber"],
  franchise: "Tangled",
  set: "009",
  text: "MAGIC HAIR {E} — Remove up to 2 damage from chosen character.",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  cardNumber: 8,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7f320853572087cd1fb899a7ceb5a7132c41758c",
  },
  abilities: [
    {
      id: "zai-1",
      type: "activated",
      effect: {
        type: "remove-damage",
        amount: 2,
        upTo: true,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "MAGIC HAIR {E} — Remove up to 2 damage from chosen character.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
};
