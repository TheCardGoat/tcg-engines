import type { ActionCard } from "@tcg/lorcana-types";
import { gleanI18n } from "./163-glean.i18n";

export const glean: ActionCard = {
  id: "XMc",
  canonicalId: "ci_XMc",
  reprints: ["set4-163"],
  cardType: "action",
  name: "Glean",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "004",
  cardNumber: 163,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_3185489386dc4b9a833fec1e0668d65f",
    tcgPlayer: 550614,
  },
  text: "Banish chosen item. Its player gains 2 lore.",
  abilities: [
    {
      effect: {
        type: "sequence",
        steps: [
          {
            target: {
              cardTypes: ["item"],
              count: 1,
              owner: "any",
              selector: "chosen",
              zones: ["play"],
            },
            type: "banish",
          },
          {
            amount: 2,
            target: "CARD_OWNER",
            type: "gain-lore",
          },
        ],
      },
      id: "wm3-1",
      text: "Banish chosen item. Its owner gains 2 lore.",
      type: "action",
    },
  ],
  i18n: gleanI18n,
};
