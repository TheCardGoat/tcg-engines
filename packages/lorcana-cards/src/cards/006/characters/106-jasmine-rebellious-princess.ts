import type { CharacterCard } from "@tcg/lorcana-types";

export const jasmineRebelliousPrincess: CharacterCard = {
  id: "zj2",
  cardType: "character",
  name: "Jasmine",
  version: "Rebellious Princess",
  fullName: "Jasmine - Rebellious Princess",
  inkType: ["ruby"],
  franchise: "Aladdin",
  set: "006",
  text: "YOU'LL NEVER MISS IT Whenever this character quests, each opponent loses 1 lore.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 106,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "800d5007d5b5ff2c47833042fe234c370d0741d4",
  },
  abilities: [
    {
      id: "zj2-1",
      type: "triggered",
      name: "YOU'LL NEVER MISS IT",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "lose-lore",
        amount: 1,
        target: "EACH_OPPONENT",
      },
      text: "YOU'LL NEVER MISS IT Whenever this character quests, each opponent loses 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};
