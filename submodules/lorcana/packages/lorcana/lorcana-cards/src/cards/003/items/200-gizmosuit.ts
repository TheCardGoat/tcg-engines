import type { ItemCard } from "@tcg/lorcana-types";
import { gizmosuitI18n } from "./200-gizmosuit.i18n";

export const gizmosuit: ItemCard = {
  id: "Ip9",
  canonicalId: "ci_Ip9",
  reprints: ["set3-200"],
  cardType: "item",
  name: "Gizmosuit",
  inkType: ["steel"],
  franchise: "Ducktales",
  set: "003",
  cardNumber: 200,
  rarity: "common",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_4ffb52f1841e434f9263e1b8973f46a6",
    tcgPlayer: 538292,
  },
  text: [
    {
      title: "CYBERNETIC ARMOR",
      description:
        "Banish this item — Chosen character gains Resist +2 until the start of your next turn.",
    },
  ],
  abilities: [
    {
      cost: {
        banishSelf: true,
      },
      effect: {
        duration: "until-start-of-next-turn",
        keyword: "Resist",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
        value: 2,
      },
      id: "1ip-1",
      name: "CYBERNETIC ARMOR",
      text: "CYBERNETIC ARMOR Banish this item — Chosen character gains Resist +2 until the start of your next turn.",
      type: "activated",
    },
  ],
  i18n: gizmosuitI18n,
};
