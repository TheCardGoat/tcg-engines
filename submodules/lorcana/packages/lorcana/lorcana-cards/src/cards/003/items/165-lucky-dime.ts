import type { ItemCard } from "@tcg/lorcana-types";
import { luckyDimeI18n } from "./165-lucky-dime.i18n";

export const luckyDime: ItemCard = {
  id: "Vpm",
  canonicalId: "ci_Vpm",
  reprints: ["set3-165"],
  cardType: "item",
  name: "Lucky Dime",
  inkType: ["sapphire"],
  franchise: "Ducktales",
  set: "003",
  cardNumber: 165,
  rarity: "legendary",
  cost: 7,
  inkable: false,
  externalIds: {
    lorcast: "crd_b4342b1e77754c4caec6596f27f963b2",
    tcgPlayer: 536272,
  },
  text: [
    {
      title: "NUMBER ONE",
      description: "{E}, 2 {I} — Choose a character of yours and gain lore equal to their {L}.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        amount: {
          type: "lore-value-of",
          target: "CHOSEN_CHARACTER_OF_YOURS",
        },
        target: "CONTROLLER",
        type: "gain-lore",
      },
      id: "Vpm-1",
      name: "NUMBER ONE",
      text: "NUMBER ONE {E}, 2 {I} — Choose a character of yours and gain lore equal to their {L}.",
      type: "activated",
    },
  ],
  i18n: luckyDimeI18n,
};
