import type { CharacterCard } from "@tcg/lorcana-types";

export const belleUntrainedMystic: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "play-card",
        from: "hand",
      },
      id: "161-1",
      text: "HERE NOW, DON'T DO THAT When you play this character, move up to 1 damage counter from chosen character to chosen opposing character.",
      type: "action",
    },
  ],
  cardNumber: 39,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Princess"],
  cost: 3,
  externalIds: {
    ravensburger: "978ddff2c7a02c8c94056556dc73c364c4039837",
  },
  franchise: "Beauty and the Beast",
  fullName: "Belle - Untrained Mystic",
  id: "161",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Belle",
  set: "009",
  strength: 3,
  text: "HERE NOW, DON'T DO THAT When you play this character, move up to 1 damage counter from chosen character to chosen opposing character.",
  version: "Untrained Mystic",
  willpower: 3,
};
