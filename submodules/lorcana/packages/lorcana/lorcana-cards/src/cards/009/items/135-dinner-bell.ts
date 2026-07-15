import type { ItemCard } from "@tcg/lorcana-types";
import { dinnerBellI18n } from "./135-dinner-bell.i18n";

export const dinnerBell: ItemCard = {
  id: "ot7",
  canonicalId: "ci_T7g",
  slug: "lorcana-ci_T7g",
  printings: [
    {
      id: "set9-135",
      artId: "set9-135",
      setCode: "set9",
      collectorNumber: "135",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set2-134", "set9-135"],
  cardType: "item",
  name: "Dinner Bell",
  inkType: ["ruby"],
  franchise: "Great Mouse Detective",
  set: "009",
  cardNumber: 135,
  rarity: "rare",
  cost: 4,
  inkable: false,
  externalIds: {
    lorcast: "crd_205f1fdf160e42a4837e5d9ca8759f45",
    tcgPlayer: "650070",
  },
  text: [
    {
      title: "YOU KNOW WHAT HAPPENS",
      description:
        "{E}, 2 {I} — Draw cards equal to the damage on chosen character of yours, then banish them.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        steps: [
          {
            amount: {
              type: "damage-on-target",
            },
            target: "CONTROLLER",
            type: "draw",
          },
          {
            target: "CHOSEN_CHARACTER_OF_YOURS",
            type: "banish",
          },
        ],
        type: "sequence",
      },
      id: "1zj-1",
      name: "YOU KNOW WHAT HAPPENS",
      text: "YOU KNOW WHAT HAPPENS {E}, 2 {I} — Draw cards equal to the damage on chosen character of yours, then banish them.",
      type: "activated",
    },
  ],
  i18n: dinnerBellI18n,
};
