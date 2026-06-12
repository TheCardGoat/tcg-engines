import type { ItemCard } from "@tcg/lorcana-types";
import { mauisFishHookI18n } from "./132-mauis-fish-hook.i18n";

export const mauisFishHook: ItemCard = {
  id: "chG",
  canonicalId: "ci_chG",
  reprints: ["set3-132"],
  cardType: "item",
  name: "Maui's Fish Hook",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "003",
  cardNumber: 132,
  rarity: "rare",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_2ad6131751ce45c681919a185cbe640a",
    tcgPlayer: 538333,
  },
  text: [
    {
      title: "IT'S MAUI TIME!",
      description:
        "If you have a character named Maui in play, you may use this item's Shapeshift ability for free.",
    },
    {
      title: "SHAPESHIFT",
      description: "{E}, 2 {I} — Choose one:",
    },
    {
      title: "• Chosen character gains Evasive until the start of your next turn.",
    },
    {
      title: "• Chosen character gets +3 {S} this turn.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        chooser: "CONTROLLER",
        options: [
          {
            type: "gain-keyword",
            keyword: "Evasive",
            duration: "until-start-of-next-turn",
            target: "CHOSEN_CHARACTER",
          },
          {
            type: "modify-stat",
            stat: "strength",
            modifier: 3,
            duration: "this-turn",
            target: "CHOSEN_CHARACTER",
          },
        ],
        type: "choice",
      },
      id: "chG-1",
      name: "SHAPESHIFT",
      text: "SHAPESHIFT {E}, 2 {I} — Choose one: · Chosen character gains Evasive until the start of your next turn. · Chosen character gets +3 {S} this turn.",
      type: "activated",
    },
    {
      condition: {
        type: "has-named-character",
        name: "Maui",
        controller: "you",
      },
      cost: {
        exert: true,
      },
      effect: {
        chooser: "CONTROLLER",
        options: [
          {
            type: "gain-keyword",
            keyword: "Evasive",
            duration: "until-start-of-next-turn",
            target: "CHOSEN_CHARACTER",
          },
          {
            type: "modify-stat",
            stat: "strength",
            modifier: 3,
            duration: "this-turn",
            target: "CHOSEN_CHARACTER",
          },
        ],
        type: "choice",
      },
      id: "chG-2",
      name: "SHAPESHIFT (IT'S MAUI TIME!)",
      text: "IT'S MAUI TIME! If you have a character named Maui in play, you may use this item's Shapeshift ability for free.",
      type: "activated",
    },
  ],
  i18n: mauisFishHookI18n,
};
