import type { CharacterCard } from "@tcg/lorcana-types";

export const rapunzelSunshine: CharacterCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        amount: 2,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "remove-damage",
        upTo: true,
      },
      id: "zai-1",
      text: "MAGIC HAIR {E} — Remove up to 2 damage from chosen character.",
      type: "activated",
    },
  ],
  cardNumber: 8,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Princess"],
  cost: 2,
  externalIds: {
    ravensburger: "7f320853572087cd1fb899a7ceb5a7132c41758c",
  },
  franchise: "Tangled",
  fullName: "Rapunzel - Sunshine",
  id: "zai",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Rapunzel",
  set: "009",
  strength: 1,
  text: "MAGIC HAIR {E} — Remove up to 2 damage from chosen character.",
  version: "Sunshine",
  willpower: 4,
};
