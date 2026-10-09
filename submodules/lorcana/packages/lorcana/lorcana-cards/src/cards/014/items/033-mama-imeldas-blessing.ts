import type { ItemCard } from "@tcg/lorcana-types";
import { mamImeldasBlessingI18n } from "./033-mama-imeldas-blessing.i18n";

export const mamImeldasBlessing: ItemCard = {
  id: "wya",
  canonicalId: "ci_wya",
  slug: "lorcana-ci_wya",
  printings: [
    {
      id: "set14-033",
      artId: "set14-033",
      setCode: "set14",
      collectorNumber: "33",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-033"],
  cardType: "item",
  name: "Mamá Imelda's Blessing",
  inkType: ["amber"],
  franchise: "Coco",
  set: "014",
  cardNumber: 33,
  rarity: "common",
  cost: 1,
  inkable: false,
  abilities: [
    {
      id: "wya-1",
      name: "FAMILIAL DUTY",
      type: "activated",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-stat",
            stat: "strength",
            modifier: -1,
            duration: "until-start-of-next-turn",
            target: "CHOSEN_CHARACTER",
          },
          {
            type: "restriction",
            restriction: "cant-sing",
            duration: "until-start-of-next-turn",
            target: { ref: "previous-target" },
          },
        ],
      },
      text: "FAMILIAL DUTY {E}, 1 {I} — Chosen character gets -1 {S} and can't {E} to sing songs until the start of your next turn.",
    },
  ],
  externalIds: {
    lorcast: "crd_1306e22e8e9e4a1fbb11a8a1ce6935c8",
  },
  text: [
    {
      title: "FAMILIAL DUTY",
      description:
        "{E}, 1 {I} — Chosen character gets -1 {S} and can't {E} to sing songs until the start of your next turn.",
    },
  ],
  i18n: mamImeldasBlessingI18n,
};
