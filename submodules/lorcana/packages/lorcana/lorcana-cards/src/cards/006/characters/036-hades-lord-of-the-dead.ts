import type { CharacterCard } from "@tcg/lorcana-types";
import { hadesLordOfTheDeadI18n } from "./036-hades-lord-of-the-dead.i18n";

export const hadesLordOfTheDead: CharacterCard = {
  id: "x5y",
  canonicalId: "ci_x5y",
  reprints: ["set6-036"],
  cardType: "character",
  name: "Hades",
  version: "Lord of the Dead",
  inkType: ["amethyst"],
  franchise: "Hercules",
  set: "006",
  cardNumber: 36,
  rarity: "rare",
  cost: 6,
  strength: 3,
  willpower: 4,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_856fe3c718b544ba808b79a6811bca02",
    tcgPlayer: 593009,
  },
  text: [
    {
      title: "SOUL COLLECTOR",
      description:
        "Whenever one of your other characters is banished during the opponent's turn, gain 2 lore.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Deity"],
  abilities: [
    {
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      id: "ox7-1",
      name: "SOUL COLLECTOR",
      text: "SOUL COLLECTOR Whenever one of your other characters is banished during the opponent's turn, gain 2 lore.",
      trigger: {
        event: "banish",
        on: "YOUR_OTHER_CHARACTERS",
        restrictions: [
          {
            type: "during-turn",
            whose: "opponent",
          },
        ],
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: hadesLordOfTheDeadI18n,
};
