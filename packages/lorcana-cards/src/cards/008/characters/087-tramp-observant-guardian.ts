import type { CharacterCard } from "@tcg/lorcana-types";

export const trampObservantGuardian: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: "SELF",
      },
      id: "fnz-1",
      name: "HOW DO I GET IN?",
      text: "HOW DO I GET IN? When you play this character, chosen character gains Ward until the start of your next turn.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 87,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 3,
  externalIds: {
    ravensburger: "387626e5bd66b83cacd57f2c76f83f9a8e014257",
  },
  franchise: "Lady and the Tramp",
  fullName: "Tramp - Observant Guardian",
  id: "fnz",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Tramp",
  set: "008",
  strength: 3,
  text: "HOW DO I GET IN? When you play this character, chosen character gains Ward until the start of your next turn. (Opponents can't choose them except to challenge.)",
  version: "Observant Guardian",
  willpower: 3,
};
