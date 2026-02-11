import type { CharacterCard } from "@tcg/lorcana-types";

export const louisEndearingAlligator: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "restriction",
        restriction: "enters-play-exerted",
        target: "SELF",
      },
      id: "h6i-1",
      name: "SENSITIVE SOUL",
      text: "SENSITIVE SOUL This character enters play exerted.",
      type: "static",
    },
    {
      effect: {
        type: "gain-keyword",
        keyword: "Reckless",
        target: "CHOSEN_CHARACTER",
      },
      id: "h6i-2",
      name: "FRIENDLIER THAN HE LOOKS",
      text: "FRIENDLIER THAN HE LOOKS When you play this character, chosen opposing character gains Reckless during their next turn.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 95,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "3deba3fa35df22e54afa3d89cb4eb78070c41c2a",
  },
  franchise: "Princess and the Frog",
  fullName: "Louis - Endearing Alligator",
  id: "h6i",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Louis",
  set: "008",
  strength: 4,
  text: "SENSITIVE SOUL This character enters play exerted.\nFRIENDLIER THAN HE LOOKS When you play this character, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
  version: "Endearing Alligator",
  willpower: 3,
};
