import type { CharacterCard } from "@tcg/lorcana-types";
import { resist } from "../../../helpers/abilities/resist";
import { kronkMeatHutCookI18n } from "./191-kronk-meat-hut-cook.i18n";

export const kronkMeatHutCook: CharacterCard = {
  id: "Ocg",
  canonicalId: "ci_Vy6",
  slug: "lorcana-ci_Vy6",
  printings: [
    {
      id: "set13-191",
      artId: "set13-191",
      setCode: "set13",
      collectorNumber: "191",
      rarity: "rare",
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
  cardNumber: 191,
  rarity: "rare",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Resist +1",
    },
    {
      title: "Pickup!",
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
  i18n: kronkMeatHutCookI18n,
};
