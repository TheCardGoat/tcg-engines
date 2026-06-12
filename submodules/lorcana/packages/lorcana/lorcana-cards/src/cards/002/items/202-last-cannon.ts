import type { ItemCard } from "@tcg/lorcana-types";
import { lastCannonI18n } from "./202-last-cannon.i18n";

export const lastCannon: ItemCard = {
  id: "Q9b",
  canonicalId: "ci_Q9b",
  reprints: ["set2-202"],
  cardType: "item",
  name: "Last Cannon",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "002",
  cardNumber: 202,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a776fb952998401394dcee6936d85b56",
    tcgPlayer: 527780,
  },
  text: [
    {
      title: "ARM YOURSELF 1",
      description:
        "{I}, Banish this item — Chosen character gains Challenger +3 this turn. (They get +3 {S} while challenging.)",
    },
  ],
  abilities: [
    {
      cost: {
        ink: 1,
        banishSelf: true,
      },
      effect: {
        duration: "this-turn",
        keyword: "Challenger",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
        value: 3,
      },
      id: "u1y-1",
      name: "ARM YOURSELF 1",
      text: "ARM YOURSELF 1 {I}, Banish this item — Chosen character gains Challenger +3 this turn.",
      type: "activated",
    },
  ],
  i18n: lastCannonI18n,
};
