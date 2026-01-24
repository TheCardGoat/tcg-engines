import type { CharacterCard } from "@tcg/lorcana-types";

export const gantuExperiencedEnforcer: CharacterCard = {
  id: "3lm",
  cardType: "character",
  name: "Gantu",
  version: "Experienced Enforcer",
  fullName: "Gantu - Experienced Enforcer",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "007",
  text: "CLOSE ALL CHANNELS When you play this character, characters can't exert to sing songs until the start of your next turn.\nDON'T GET ANY IDEAS Each player pays 2 {I} more to play actions or items. (This doesn’t apply to singing songs.)",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 199,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0cf9ec8277220e1e3790acd6c84c33cd9edb0ceb",
  },
  abilities: [
    {
      id: "3lm-2",
      type: "action",
      effect: {
        type: "play-card",
        from: "hand",
      },
      text: "DON'T GET ANY IDEAS Each player pays 2 {I} more to play actions or items.",
    },
  ],
  classifications: ["Storyborn", "Alien", "Captain"],
};
