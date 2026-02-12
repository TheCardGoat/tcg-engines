import type { CharacterCard } from "@tcg/lorcana-types";

export const belleInventiveEngineer: CharacterCard = {
  abilities: [
    {
      effect: {
        from: "hand",
        type: "play-card",
      },
      id: "11d-1",
      name: "TINKER",
      text: "TINKER Whenever this character quests, you pay 1 {I} less for the next item you play this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 156,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Princess", "Inventor"],
  cost: 3,
  externalIds: {
    ravensburger: "86b4fc6edf4957af2c46cf5c14f83207899645cc",
  },
  franchise: "Beauty and the Beast",
  fullName: "Belle - Inventive Engineer",
  id: "11d",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Belle",
  set: "009",
  strength: 2,
  text: "TINKER Whenever this character quests, you pay 1 {I} less for the next item you play this turn.",
  version: "Inventive Engineer",
  willpower: 3,
};
