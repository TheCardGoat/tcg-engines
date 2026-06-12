import type { ActionCard } from "@tcg/lorcana-types";
import { singTogether } from "../../../helpers/abilities/singTogether";
import { underTheSeaI18n } from "./095-under-the-sea.i18n";

export const underTheSea: ActionCard = {
  id: "EhX",
  canonicalId: "ci_BAQ",
  reprints: ["set4-095", "set9-097"],
  cardType: "action",
  name: "Under the Sea",
  inkType: ["emerald"],
  franchise: "Little Mermaid",
  set: "004",
  cardNumber: 95,
  rarity: "rare",
  cost: 8,
  inkable: false,
  externalIds: {
    lorcast: "crd_1d6a3d2a881b42f0a7160c2617e19fea",
    tcgPlayer: 650035,
  },
  text: [
    {
      title: "Sing Together 8",
      description:
        "(Any number of your or your teammates' characters with total cost 8 or more may {E} to sing this song for free.)",
    },
    {
      title:
        "Put all opposing characters with 2 {S} or less on the bottom of their players' decks in any order.",
    },
  ],
  actionSubtype: "song",
  abilities: [
    singTogether(8),
    {
      name: "ACTION",
      text: "Put all opposing characters with 2 {S} or less on the bottom of their players' decks in any order.",
      type: "action",
      effect: {
        type: "put-on-bottom",
        ordering: "player-choice",
        orderBy: "controller",
        target: {
          selector: "all",
          count: "all",
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "strength-comparison",
              comparison: "less-or-equal",
              value: 2,
            },
          ],
        },
      },
    },
  ],
  i18n: underTheSeaI18n,
};
