import type { CharacterCard } from "@tcg/lorcana-types";
import { kronkMeatHutCookEpicI18n } from "./223-kronk-meat-hut-cook-epic.i18n";

import { resist } from "../../../helpers/abilities/resist";

export const kronkMeatHutCookEpic: CharacterCard = {
  id: "DUt",
  canonicalId: "ci_Vy6",
  slug: "lorcana-ci_Vy6",
  printings: [
    {
      id: "set13-223-epic",
      artId: "ci_Vy6-epic",
      setCode: "set13",
      collectorNumber: "223",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set13-191"],
  cardType: "character",
  name: "Kronk",
  version: "Meat Hut Cook",
  inkType: ["steel"],
  franchise: "Emperors New Groove",
  set: "013",
  cardNumber: 223,
  rarity: "epic",
  specialRarity: "epic",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_8cdf79cd59a244c6b5b6c657d10d3142",
    tcgPlayer: "704686",
  },
  text: [
    {
      title: "Resist +1",
    },
    {
      title: "PICKUP!",
      description:
        "Once during your turn, you may pay 1 {I} to draw a card, then choose and discard a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    resist(1),
    {
      type: "activated",
      name: "PICKUP!",
      text: "PICKUP! Once during your turn, you may pay 1 {I} to draw a card, then choose and discard a card.",
      cost: {
        ink: 1,
      },
      restrictions: [
        {
          type: "once-per-turn",
        },
        {
          type: "during-turn",
          whose: "your",
        },
      ],
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
          {
            type: "discard",
            amount: 1,
            target: "CONTROLLER",
            chosen: true,
          },
        ],
      },
    },
  ],
  i18n: kronkMeatHutCookEpicI18n,
};
