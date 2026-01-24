import type { CharacterCard } from "@tcg/lorcana-types";

export const louisEndearingAlligator: CharacterCard = {
  id: "h6i",
  cardType: "character",
  name: "Louis",
  version: "Endearing Alligator",
  fullName: "Louis - Endearing Alligator",
  inkType: ["emerald"],
  franchise: "Princess and the Frog",
  set: "008",
  text: "SENSITIVE SOUL This character enters play exerted.\nFRIENDLIER THAN HE LOOKS When you play this character, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 95,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3deba3fa35df22e54afa3d89cb4eb78070c41c2a",
  },
  abilities: [
    {
      id: "h6i-1",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "enters-play-exerted",
        target: "SELF",
      },
      name: "SENSITIVE SOUL",
      text: "SENSITIVE SOUL This character enters play exerted.",
    },
    {
      id: "h6i-2",
      type: "triggered",
      name: "FRIENDLIER THAN HE LOOKS",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Reckless",
        target: "CHOSEN_CHARACTER",
      },
      text: "FRIENDLIER THAN HE LOOKS When you play this character, chosen opposing character gains Reckless during their next turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
