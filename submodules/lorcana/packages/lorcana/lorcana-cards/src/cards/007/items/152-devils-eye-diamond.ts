import type { ItemCard } from "@tcg/lorcana-types";
import { devilsEyeDiamondI18n } from "./152-devils-eye-diamond.i18n";

export const devilsEyeDiamond: ItemCard = {
  id: "47U",
  canonicalId: "ci_o00",
  reprints: ["set7-152"],
  cardType: "item",
  name: "Devil's Eye Diamond",
  inkType: ["ruby"],
  franchise: "Rescuers",
  set: "007",
  cardNumber: 152,
  rarity: "rare",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_6a4c5fe1b3b74110acd16d725f8cc3f6",
    tcgPlayer: 619746,
  },
  text: [
    {
      title: "THE PRICE OF POWER",
      description: "{E} — If one of your characters took damage this turn, gain 1 lore.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        type: "conditional",
        condition: {
          type: "turn-metric",
          metric: "damaged-characters-by-owner",
          ownerScope: "you",
          comparison: {
            operator: "gt",
            value: 0,
          },
        },
        then: {
          amount: 1,
          type: "gain-lore",
        },
      },
      id: "136-1",
      name: "THE PRICE OF POWER",
      text: "THE PRICE OF POWER {E} — If one of your characters took damage this turn, gain 1 lore.",
      type: "activated",
    },
  ],
  i18n: devilsEyeDiamondI18n,
};
