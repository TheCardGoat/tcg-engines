import type { ActionCard } from "@tcg/lorcana-types";
import { thoughIHaveToSayGoodbyeI18n } from "./131-though-i-have-to-say-goodbye.i18n";

export const thoughIHaveToSayGoodbye: ActionCard = {
  id: "XHF",
  canonicalId: "ci_XHF",
  slug: "lorcana-ci_XHF",
  printings: [
    {
      id: "set14-131",
      artId: "set14-131",
      setCode: "set14",
      collectorNumber: "131",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-131"],
  cardType: "action",
  name: "Though I Have to Say Goodbye",
  inkType: ["ruby"],
  franchise: "Coco",
  set: "014",
  cardNumber: 131,
  rarity: "rare",
  cost: 2,
  inkable: true,
  text: "Put the top 3 cards of your deck into your discard. Chosen character gets +1 {S} this turn for each song card in your discard.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      text: "Put the top 3 cards of your deck into your discard. Chosen character gets +1 {S} this turn for each song card in your discard.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "mill",
            amount: 3,
            target: "CONTROLLER",
          },
          {
            type: "modify-stat",
            stat: "strength",
            modifier: {
              type: "filtered-count",
              filters: [{ type: "is-song" }],
              owner: "you",
              zones: ["discard"],
            },
            duration: "this-turn",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
        ],
      },
    },
  ],
  i18n: thoughIHaveToSayGoodbyeI18n,
};
