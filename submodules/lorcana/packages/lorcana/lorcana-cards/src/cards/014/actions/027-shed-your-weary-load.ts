import type { ActionCard } from "@tcg/lorcana-types";
import { shedYourWearyLoadI18n } from "./027-shed-your-weary-load.i18n";

export const shedYourWearyLoad: ActionCard = {
  id: "uqv",
  canonicalId: "ci_uqv",
  slug: "lorcana-ci_uqv",
  printings: [
    {
      id: "set14-027",
      artId: "set14-027",
      setCode: "set14",
      collectorNumber: "27",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-027"],
  cardType: "action",
  name: "Shed Your Weary Load",
  inkType: ["amber"],
  franchise: "Goofy Movie",
  set: "014",
  cardNumber: 27,
  rarity: "rare",
  cost: 5,
  inkable: false,
  text: "Chosen opponent reveals their hand and discards each non-character card revealed this way.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      text: "Chosen opponent reveals their hand and discards each non-character card revealed this way.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "reveal-hand",
            target: "OPPONENT",
          },
          {
            type: "discard",
            amount: "all",
            target: "OPPONENT",
            from: "hand",
            filter: {
              notCardType: "character",
            },
          },
        ],
      },
    },
  ],
  i18n: shedYourWearyLoadI18n,
};
