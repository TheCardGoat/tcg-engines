import type { ActionCard } from "@tcg/lorcana-types";
import { thisIsBusinessI18n } from "./097-this-is-business.i18n";

export const thisIsBusiness: ActionCard = {
  id: "5lt",
  canonicalId: "ci_5lt",
  slug: "lorcana-ci_5lt",
  printings: [
    {
      id: "set14-097",
      artId: "set14-097",
      setCode: "set14",
      collectorNumber: "97",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-097"],
  cardType: "action",
  name: "This Is Business",
  inkType: ["emerald"],
  franchise: "Talespin",
  set: "014",
  cardNumber: 97,
  rarity: "rare",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_37a9e3decc584edda6f380f475146fb8",
  },
  text: [
    {
      title: "Chosen opponent chooses one:",
    },
    {
      title:
        "• They reveal their hand and discard a card of your choice. They get 2 ink drops. (Each ink drop may be removed to pay 1 {I}.)",
    },
    {
      title: "• You draw a card and get 2 ink drops.",
    },
  ],
  abilities: [
    {
      type: "action",
      text: "Chosen opponent chooses one: They reveal their hand and discard a card of your choice. They get 2 ink drops. Or you draw a card and get 2 ink drops.",
      effect: {
        type: "choice",
        chooser: { selector: "chosen", count: 1, excludeSelf: true },
        optionLabels: [
          "They reveal their hand and discard a card of your choice. They get 2 ink drops.",
          "You draw a card and get 2 ink drops.",
        ],
        options: [
          {
            type: "sequence",
            steps: [
              {
                type: "reveal-hand",
                target: "CHOSEN_PLAYER",
              },
              {
                type: "discard",
                amount: 1,
                target: "CHOSEN_PLAYER",
                from: "hand",
                chosen: true,
                chosenBy: "you",
              },
              {
                type: "gain-ink-drop",
                amount: 2,
                target: "CHOSEN_PLAYER",
              },
            ],
          },
          {
            type: "sequence",
            steps: [
              {
                type: "draw",
                amount: 1,
                target: "CONTROLLER",
              },
              {
                type: "gain-ink-drop",
                amount: 2,
                target: "CONTROLLER",
              },
            ],
          },
        ],
      },
    },
  ],
  i18n: thisIsBusinessI18n,
};
