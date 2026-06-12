import type { ActionCard } from "@tcg/lorcana-types";
import { thisIsMyFamilyI18n } from "./081-this-is-my-family.i18n";

export const thisIsMyFamily: ActionCard = {
  id: "7pX",
  canonicalId: "ci_7pX",
  reprints: ["set7-081"],
  cardType: "action",
  name: "This Is My Family",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "007",
  cardNumber: 81,
  rarity: "common",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_703029977ead4c46bf7f4991b6fd1736",
    tcgPlayer: 619448,
  },
  text: "Gain 1 lore. Draw a card.",
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        steps: [
          {
            amount: 1,
            type: "gain-lore",
          },
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
        ],
        type: "sequence",
      },
      id: "1io-1",
      text: "Gain 1 lore. Draw a card.",
      type: "action",
    },
  ],
  i18n: thisIsMyFamilyI18n,
};
