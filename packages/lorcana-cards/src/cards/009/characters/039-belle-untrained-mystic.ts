import type { CharacterCard } from "@tcg/lorcana-types";

export const belleUntrainedMystic: CharacterCard = {
  id: "161",
  cardType: "character",
  name: "Belle",
  version: "Untrained Mystic",
  fullName: "Belle - Untrained Mystic",
  inkType: ["amethyst"],
  franchise: "Beauty and the Beast",
  set: "009",
  text: "HERE NOW, DON'T DO THAT When you play this character, move up to 1 damage counter from chosen character to chosen opposing character.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 39,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "978ddff2c7a02c8c94056556dc73c364c4039837",
  },
  abilities: [
    {
      id: "161-1",
      type: "action",
      effect: {
        type: "play-card",
        from: "hand",
      },
      text: "HERE NOW, DON'T DO THAT When you play this character, move up to 1 damage counter from chosen character to chosen opposing character.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
};
