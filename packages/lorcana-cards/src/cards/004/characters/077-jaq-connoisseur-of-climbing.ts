import type { CharacterCard } from "@tcg/lorcana-types";

export const jaqConnoisseurOfClimbing: CharacterCard = {
  id: "1u5",
  cardType: "character",
  name: "Jaq",
  version: "Connoisseur of Climbing",
  fullName: "Jaq - Connoisseur of Climbing",
  inkType: ["emerald"],
  franchise: "Cinderella",
  set: "004",
  text: "SNEAKY IDEA When you play this character, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 2,
  cardNumber: 77,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f0675a175f212c4b0fba027fb9728620ab990e7c",
  },
  abilities: [
    {
      id: "1u5-1",
      type: "triggered",
      name: "SNEAKY IDEA",
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
      text: "SNEAKY IDEA When you play this character, chosen opposing character gains Reckless during their next turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
