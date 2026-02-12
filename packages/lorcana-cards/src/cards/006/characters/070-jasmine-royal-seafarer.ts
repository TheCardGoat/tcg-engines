import type { CharacterCard } from "@tcg/lorcana-types";

export const jasmineRoyalSeafarer: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-keyword",
        keyword: "Reckless",
        target: "CHOSEN_CHARACTER",
      },
      id: "1pj-3",
      text: "* Chosen opposing character gains Reckless during their next turn.",
      type: "action",
    },
  ],
  cardNumber: 70,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 3,
  externalIds: {
    ravensburger: "ddd60bc122f1c34cf707e969a06f3117df19f03f",
  },
  franchise: "Aladdin",
  fullName: "Jasmine - Royal Seafarer",
  id: "1pj",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingImplementation: true,
  missingTests: true,
  name: "Jasmine",
  set: "006",
  strength: 2,
  text: "BY ORDER OF THE PRINCESS When you play this character, choose one: \n* Exert chosen damaged character. \n* Chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
  version: "Royal Seafarer",
  willpower: 3,
};
