import type { CharacterCard } from "@tcg/lorcana-types";
import { vinnieGreenPigeonI18n } from "./194-vinnie-green-pigeon.i18n";

export const vinnieGreenPigeon: CharacterCard = {
  id: "f0C",
  canonicalId: "ci_f0C",
  reprints: ["set8-194"],
  cardType: "character",
  name: "Vinnie",
  version: "Green Pigeon",
  inkType: ["steel"],
  franchise: "Bolt",
  set: "008",
  cardNumber: 194,
  rarity: "rare",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_81959a7827c2427d9ec829539d2a7418",
    tcgPlayer: 631479,
  },
  text: [
    {
      title: "LEARNING EXPERIENCE",
      description:
        "During an opponent's turn, whenever one of your other characters is banished, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    {
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      id: "ogk-1",
      name: "LEARNING EXPERIENCE",
      text: "LEARNING EXPERIENCE During an opponent's turn, whenever one of your other characters is banished, gain 1 lore.",
      trigger: {
        event: "banish",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "opponent",
          },
        ],
      },
      type: "triggered",
    },
  ],
  i18n: vinnieGreenPigeonI18n,
};
