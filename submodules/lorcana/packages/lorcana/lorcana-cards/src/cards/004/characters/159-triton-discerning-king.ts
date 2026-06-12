import type { CharacterCard } from "@tcg/lorcana-types";
import { tritonDiscerningKingI18n } from "./159-triton-discerning-king.i18n";

export const tritonDiscerningKing: CharacterCard = {
  id: "nit",
  canonicalId: "ci_nit",
  reprints: ["set4-159"],
  cardType: "character",
  name: "Triton",
  version: "Discerning King",
  inkType: ["sapphire"],
  franchise: "Little Mermaid",
  set: "004",
  cardNumber: 159,
  rarity: "rare",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_a2ef85d2f5774b6d910349770f5db42e",
    tcgPlayer: 549621,
  },
  text: [
    {
      title: "CONSIGN TO THE DEPTHS",
      description: "{E}, Banish one of your items — Gain 3 lore.",
    },
  ],
  classifications: ["Storyborn", "King"],
  abilities: [
    {
      cost: {
        exert: true,
        banishItem: true,
      },
      effect: {
        amount: 3,
        type: "gain-lore",
      },
      id: "rj9-1",
      name: "CONSIGN TO THE DEPTHS",
      text: "CONSIGN TO THE DEPTHS {E}, Banish one of your items — Gain 3 lore.",
      type: "activated",
    },
  ],
  i18n: tritonDiscerningKingI18n,
};
