import type { ActionCard } from "@tcg/lorcana-types";
import { redAlertI18n } from "./135-red-alert.i18n";

export const redAlert: ActionCard = {
  id: "qZ0",
  canonicalId: "ci_qZ0",
  slug: "lorcana-ci_qZ0",
  printings: [
    {
      id: "set13-135",
      artId: "set13-135",
      setCode: "set13",
      collectorNumber: "135",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-135"],
  cardType: "action",
  name: "Red Alert",
  inkType: ["ruby"],
  franchise: "Monsters, Inc.",
  set: "013",
  cardNumber: 135,
  rarity: "uncommon",
  cost: 4,
  inkable: true,
  text: "Banish chosen character with 3 {S} or less. If you have a Monster character in play, chosen opponent loses 1 lore.",
  abilities: [
    {
      type: "action",
      text: "Banish chosen character with 3 {S} or less. If you have a Monster character in play, chosen opponent loses 1 lore.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "banish",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
              filter: [
                {
                  type: "strength-comparison",
                  comparison: "less-or-equal",
                  value: 3,
                },
              ],
            },
          },
          {
            type: "conditional",
            condition: {
              type: "has-character-with-classification",
              controller: "you",
              classification: "Monster",
            },
            effect: {
              type: "lose-lore",
              amount: 1,
              target: "OPPONENT",
            },
          },
        ],
      },
    },
  ],
  i18n: redAlertI18n,
};
