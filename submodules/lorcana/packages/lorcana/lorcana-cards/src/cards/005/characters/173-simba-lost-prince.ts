import type { CharacterCard } from "@tcg/lorcana-types";
import { simbaLostPrinceI18n } from "./173-simba-lost-prince.i18n";

export const simbaLostPrince: CharacterCard = {
  id: "RA4",
  canonicalId: "ci_RA4",
  reprints: ["set5-173"],
  cardType: "character",
  name: "Simba",
  version: "Lost Prince",
  inkType: ["steel"],
  franchise: "Lion King",
  set: "005",
  cardNumber: 173,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_1b36e531978a4a9eae7c7acd0d4436b8",
    tcgPlayer: 560243,
  },
  text: [
    {
      title: "FACE THE PAST",
      description:
        "During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
  abilities: [
    {
      id: "1e1-1",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      name: "FACE THE PAST",
      trigger: {
        event: "banish-in-challenge",
        on: "SELF",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
        timing: "whenever",
      },
      type: "triggered",
      text: "FACE THE PAST During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
    },
  ],
  i18n: simbaLostPrinceI18n,
};
