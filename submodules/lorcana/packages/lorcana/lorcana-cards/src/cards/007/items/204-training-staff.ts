import type { ItemCard } from "@tcg/lorcana-types";
import { trainingStaffI18n } from "./204-training-staff.i18n";

export const trainingStaff: ItemCard = {
  id: "T3y",
  canonicalId: "ci_T3y",
  reprints: ["set7-204"],
  cardType: "item",
  name: "Training Staff",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "007",
  cardNumber: 204,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_58e5277d1e554fd28d2b56ce65317d81",
    tcgPlayer: 619526,
  },
  text: [
    {
      title: "PRECISION STRIKE",
      description:
        "{E}, 1 {I} — Chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        duration: "this-turn",
        keyword: "Challenger",
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
      id: "1rn-1",
      name: "PRECISION STRIKE",
      text: "PRECISION STRIKE {E}, 1 {I} — Chosen character gains Challenger +2 this turn.",
      type: "activated",
    },
  ],
  i18n: trainingStaffI18n,
};
