import type { CharacterCard } from "@tcg/op-types";
import { prb02CharlotteBruleePirateFoil003I18n } from "./st20-003-charlotte-brulee-pirate-foil.i18n.ts";

export const prb02CharlotteBruleePirateFoil003: CharacterCard = {
  id: "ST20-003",
  canonicalId: "ST20-003",
  slug: "charlotte-brulee-pirate-foil",
  name: "Charlotte Brulee",
  printings: [
    {
      id: "ST20-003",
      artId: "ST20-003",
      setCode: "ST20",
      collectorNumber: "003",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST20-003_p1.jpg",
      label: "Charlotte Brulee (Pirate Foil)",
    },
    {
      id: "ST20-003_r1",
      artId: "ST20-003_r1",
      setCode: "ST20",
      collectorNumber: "003",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST20-003_r1.jpg",
      label: "Charlotte Brulee (Reprint)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "ST20",
  cost: 3,
  power: 3000,
  counter: 2000,
  trigger:
    "Look at up to 1 card from the top of your or your opponent's Life cards, and place it at the top or bottom of the Life cards. Then, add this card to your hand.",
  traits: ["Big Mom Pirates"],
  attribute: "special",
  effect:
    "[Trigger] Look at up to 1 card from the top of your or your opponent's Life cards, and place it at the top or bottom of the Life cards. Then, add this card to your hand.",
  effects: {
    effects: [
      {
        trigger: "trigger",
        actions: [
          {
            action: "lookAtLife",
            player: "either",
            position: "topOrBottom",
            upTo: true,
          },
          {
            action: "addThisCardToHand",
          },
        ],
      },
    ],
  },
  i18n: prb02CharlotteBruleePirateFoil003I18n,
};
