import type { CharacterCard } from "@tcg/lorcana-types";

export const jasmineRoyalSeafarer: CharacterCard = {
  id: "1pj",
  cardType: "character",
  name: "Jasmine",
  version: "Royal Seafarer",
  fullName: "Jasmine - Royal Seafarer",
  inkType: ["emerald"],
  franchise: "Aladdin",
  set: "006",
  text: "BY ORDER OF THE PRINCESS When you play this character, choose one: \n* Exert chosen damaged character. \n* Chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 70,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ddd60bc122f1c34cf707e969a06f3117df19f03f",
  },
  abilities: [
    {
      id: "1pj-3",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Reckless",
        target: "CHOSEN_CHARACTER",
      },
      text: "* Chosen opposing character gains Reckless during their next turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};
