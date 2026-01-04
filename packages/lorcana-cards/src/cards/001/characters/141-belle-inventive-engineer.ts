import type { CharacterCard } from "@tcg/lorcana-types";

export const belleinventiveEngineer: CharacterCard = {
  id: "vuf",
  cardType: "character",
  name: "Belle",
  version: "Inventive Engineer",
  fullName: "Belle - Inventive Engineer",
  inkType: ["sapphire"],
  franchise: "Disney",
  set: "001",
  text: "**TINKER** Whenever this character quests, you pay 1 {I} less for the next item you play this turn.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 141,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**TINKER** Whenever this character quests, you pay 1 {I} less for the next item you play this turn.",
      id: "vuf-1",
      effect: {
        type: "play-card",
        from: "hand",
      },
    },
  ],
  classifications: ["Hero", "Dreamborn", "Inventor", "Princess"],
};
