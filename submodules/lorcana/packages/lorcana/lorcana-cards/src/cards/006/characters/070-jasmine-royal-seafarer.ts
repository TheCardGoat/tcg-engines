import type { CharacterCard } from "@tcg/lorcana-types";
import { jasmineRoyalSeafarerI18n } from "./070-jasmine-royal-seafarer.i18n";

export const jasmineRoyalSeafarer: CharacterCard = {
  id: "Iyt",
  canonicalId: "ci_Iyt",
  reprints: ["set6-070"],
  cardType: "character",
  name: "Jasmine",
  version: "Royal Seafarer",
  inkType: ["emerald"],
  franchise: "Aladdin",
  set: "006",
  cardNumber: 70,
  rarity: "rare",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_3aa1cf07954647c89708b98355e6c976",
    tcgPlayer: 586172,
  },
  text: [
    {
      title: "BY ORDER OF THE PRINCESS",
      description: "When you play this character, choose one:",
    },
    {
      title: "* Exert chosen damaged character.",
    },
    {
      title:
        "* Chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      id: "Iyt-1",
      name: "BY ORDER OF THE PRINCESS",
      text: "BY ORDER OF THE PRINCESS When you play this character, choose one: * Exert chosen damaged character. * Chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "choice",
        optionLabels: [
          "Exert chosen damaged character.",
          "Chosen opposing character gains Reckless during their next turn.",
        ],
        options: [
          {
            type: "exert",
            target: "CHOSEN_DAMAGED_CHARACTER",
          },
          {
            type: "gain-keyword",
            keyword: "Reckless",
            duration: "their-next-turn",
            target: "CHOSEN_OPPOSING_CHARACTER",
          },
        ],
      },
    },
  ],
  i18n: jasmineRoyalSeafarerI18n,
};
