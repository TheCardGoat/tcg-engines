import type { CharacterCard } from "@tcg/op-types";
import { op15Kyros042I18n } from "./op15-042-kyros.i18n.ts";

export const op15Kyros042: CharacterCard = {
  id: "OP15-042",
  canonicalId: "OP15-042",
  slug: "kyros/op15-042",
  name: "Kyros",
  printings: [
    {
      id: "OP15-042",
      artId: "OP15-042",
      setCode: "OP15",
      collectorNumber: "042",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-042_VMyCN4V.jpg",
    },
    {
      id: "OP15-042_p1",
      artId: "OP15-042",
      setCode: "OP15",
      collectorNumber: "042",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-042_8B97keJ.jpg",
      label: "Kyros (Dash Pack)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP15",
  cost: 3,
  power: 5000,
  traits: ["Dressrosa"],
  attribute: "slash",
  effect:
    "[On Play] You may trash 1 card from your hand: If your Leader is [Rebecca], this Character gains [Rush] during this turn.\n[On K.O.] Add this Character card from your trash to your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "rush",
            duration: "thisTurn",
            condition: {
              condition: "leaderName",
              name: "Rebecca",
            },
          },
        ],
        optional: true,
      },
      {
        trigger: "onKo",
        actions: [
          {
            action: "addThisCardToHand",
          },
        ],
      },
    ],
  },
  i18n: op15Kyros042I18n,
};
