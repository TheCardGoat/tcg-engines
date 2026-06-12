import type { ItemCard } from "@tcg/lorcana-types";
import { fairyGodmothersWandI18n } from "./168-fairy-godmothers-wand.i18n";

export const fairyGodmothersWand: ItemCard = {
  id: "yp6",
  canonicalId: "ci_yp6",
  reprints: ["set10-168"],
  cardType: "item",
  name: "Fairy Godmother's Wand",
  inkType: ["sapphire"],
  franchise: "Cinderella",
  set: "010",
  cardNumber: 168,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_ddf2f3b6243d46b693fa4c08113e8930",
    tcgPlayer: 658786,
  },
  text: [
    {
      title: "ONLY TILL MIDNIGHT",
      description:
        "During your turn, whenever you put a card into your inkwell, chosen Princess character of yours gains Ward until the start of your next turn.",
    },
  ],
  abilities: [
    {
      effect: {
        duration: "until-start-of-next-turn",
        keyword: "Ward",
        target: {
          selector: "chosen",
          count: 1,
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Princess",
            },
          ],
        },
        type: "gain-keyword",
      },
      id: "1y8-1",
      name: "ONLY TILL MIDNIGHT",
      text: "ONLY TILL MIDNIGHT During your turn, whenever you put a card into your inkwell, chosen Princess character of yours gains Ward until the start of your next turn.",
      trigger: {
        event: "ink",
        on: "CONTROLLER",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: fairyGodmothersWandI18n,
};
