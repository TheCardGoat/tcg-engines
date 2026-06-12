import type { CharacterCard } from "@tcg/lorcana-types";
import { simbaRightfulHeirI18n } from "./190-simba-rightful-heir.i18n";

export const simbaRightfulHeir: CharacterCard = {
  id: "XnN",
  canonicalId: "ci_XnN",
  reprints: ["set1-190"],
  cardType: "character",
  name: "Simba",
  version: "Rightful Heir",
  inkType: ["steel"],
  franchise: "Lion King",
  set: "001",
  cardNumber: 190,
  rarity: "uncommon",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_b2976a87410e4dd5a753e7f871c2b6fc",
    tcgPlayer: 508941,
  },
  text: [
    {
      title: "I KNOW WHAT I HAVE TO DO",
      description:
        "During your turn, whenever this character banishes another character in a challenge, you gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
  abilities: [
    {
      name: "I KNOW WHAT I HAVE TO DO",
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      id: "ac0-1",
      text: "I KNOW WHAT I HAVE TO DO During your turn, whenever this character banishes another character in a challenge, you gain 1 lore.",
      trigger: {
        event: "banish-in-challenge",
        on: "SELF",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      type: "triggered",
    },
  ],
  i18n: simbaRightfulHeirI18n,
};
