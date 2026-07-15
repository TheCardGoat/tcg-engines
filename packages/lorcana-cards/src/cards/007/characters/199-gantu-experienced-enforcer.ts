import type { CharacterCard } from "@tcg/lorcana-types";

export const gantuExperiencedEnforcer: CharacterCard = {
  abilities: [
    {
      effect: {
        from: "hand",
        type: "play-card",
      },
      id: "3lm-2",
      text: "DON'T GET ANY IDEAS Each player pays 2 {I} more to play actions or items.",
      type: "action",
    },
  ],
  cardNumber: 199,
  cardType: "character",
  classifications: ["Storyborn", "Alien", "Captain"],
  cost: 4,
  externalIds: {
    ravensburger: "0cf9ec8277220e1e3790acd6c84c33cd9edb0ceb",
  },
  franchise: "Lilo and Stitch",
  fullName: "Gantu - Experienced Enforcer",
  id: "3lm",
  inkType: ["steel"],
  inkable: false,
  lore: 1,
  missingImplementation: true,
  missingTests: true,
  name: "Gantu",
  set: "007",
  strength: 2,
  text: "CLOSE ALL CHANNELS When you play this character, characters can't exert to sing songs until the start of your next turn.\nDON'T GET ANY IDEAS Each player pays 2 {I} more to play actions or items. (This doesn’t apply to singing songs.)",
  version: "Experienced Enforcer",
  willpower: 4,
};
