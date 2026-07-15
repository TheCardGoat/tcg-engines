import type { CharacterCard } from "@tcg/lorcana-types";

export const jaqConnoisseurOfClimbing: CharacterCard = {
  abilities: [
    {
      effect: {
        keyword: "Reckless",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
      },
      id: "1u5-1",
      name: "SNEAKY IDEA",
      text: "SNEAKY IDEA When you play this character, chosen opposing character gains Reckless during their next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 77,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "f0675a175f212c4b0fba027fb9728620ab990e7c",
  },
  franchise: "Cinderella",
  fullName: "Jaq - Connoisseur of Climbing",
  id: "1u5",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Jaq",
  set: "004",
  strength: 1,
  text: "SNEAKY IDEA When you play this character, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
  version: "Connoisseur of Climbing",
  willpower: 4,
};
