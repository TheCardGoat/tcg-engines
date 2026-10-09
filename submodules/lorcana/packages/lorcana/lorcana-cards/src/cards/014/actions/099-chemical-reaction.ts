import type { ActionCard } from "@tcg/lorcana-types";
import { chemicalReactionI18n } from "./099-chemical-reaction.i18n";

export const chemicalReaction: ActionCard = {
  id: "M4n",
  canonicalId: "ci_M4n",
  slug: "lorcana-ci_M4n",
  printings: [
    {
      id: "set14-099",
      artId: "set14-099",
      setCode: "set14",
      collectorNumber: "99",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-099"],
  cardType: "action",
  name: "Chemical Reaction",
  inkType: ["emerald"],
  franchise: "Big Hero 6",
  set: "014",
  cardNumber: 99,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  text: "Draw a card. You may banish chosen item of yours. If you do, chosen opponent chooses and discards a card.",
  abilities: [
    {
      type: "action",
      text: "Draw a card. You may banish chosen item of yours. If you do, chosen opponent chooses and discards a card.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
          {
            type: "optional",
            chooser: "CONTROLLER",
            effect: {
              type: "banish",
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["item"],
              },
            },
          },
          {
            type: "conditional",
            condition: {
              type: "if-you-do",
            },
            then: {
              type: "discard",
              amount: 1,
              target: { selector: "chosen", count: 1, excludeSelf: true },
              from: "hand",
              chosen: true,
            },
          },
        ],
      },
    },
  ],
  i18n: chemicalReactionI18n,
};
