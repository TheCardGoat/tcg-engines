import type { CharacterCard } from "@tcg/lorcana-types";

export const magicBroomBucketBrigade: CharacterCard = {
  id: "zyc",
  cardType: "character",
  name: "Magic Broom",
  version: "Bucket Brigade",
  fullName: "Magic Broom - Bucket Brigade",
  inkType: ["amethyst"],
  franchise: "Disney",
  set: "001",
  text: "**SWEEP** When you play this character, you may shuffle a card from any discard into its player",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 47,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**SWEEP** When you play this character, you may shuffle a card from any discard into its player",
      id: "zyc-1",
      effect: {
        type: "play-card",
        from: "hand",
      },
    },
  ],
  classifications: ["Dreamborn", "Broom"],
};
