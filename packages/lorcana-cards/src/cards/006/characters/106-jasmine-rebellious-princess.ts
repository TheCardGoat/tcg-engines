import type { CharacterCard } from "@tcg/lorcana-types";

export const jasmineRebelliousPrincess: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "lose-lore",
        amount: 1,
        target: "EACH_OPPONENT",
      },
      id: "zj2-1",
      name: "YOU'LL NEVER MISS IT",
      text: "YOU'LL NEVER MISS IT Whenever this character quests, each opponent loses 1 lore.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 106,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 3,
  externalIds: {
    ravensburger: "800d5007d5b5ff2c47833042fe234c370d0741d4",
  },
  franchise: "Aladdin",
  fullName: "Jasmine - Rebellious Princess",
  id: "zj2",
  inkType: ["ruby"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Jasmine",
  set: "006",
  strength: 2,
  text: "YOU'LL NEVER MISS IT Whenever this character quests, each opponent loses 1 lore.",
  version: "Rebellious Princess",
  willpower: 3,
};
