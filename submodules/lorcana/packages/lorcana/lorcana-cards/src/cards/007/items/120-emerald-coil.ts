import type { ItemCard } from "@tcg/lorcana-types";
import { emeraldCoilI18n } from "./120-emerald-coil.i18n";

export const emeraldCoil: ItemCard = {
  id: "jH6",
  canonicalId: "ci_jH6",
  reprints: ["set7-120"],
  cardType: "item",
  name: "Emerald Coil",
  inkType: ["emerald"],
  franchise: "Lorcana",
  set: "007",
  cardNumber: 120,
  rarity: "uncommon",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_6109e70026c649f2baca4f9656b66510",
    tcgPlayer: 619471,
  },
  text: [
    {
      title: "SHIMMERING WINGS",
      description:
        "During your turn, whenever a card is put into your inkwell, chosen character gains Evasive until the start of your next turn.",
    },
  ],
  abilities: [
    {
      effect: {
        duration: "until-start-of-next-turn",
        keyword: "Evasive",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
      },
      id: "1xj-1",
      name: "SHIMMERING WINGS",
      text: "SHIMMERING WINGS During your turn, whenever a card is put into your inkwell, chosen character gains Evasive until the start of your next turn.",
      trigger: {
        event: "ink",
        on: "CONTROLLER",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: emeraldCoilI18n,
};
