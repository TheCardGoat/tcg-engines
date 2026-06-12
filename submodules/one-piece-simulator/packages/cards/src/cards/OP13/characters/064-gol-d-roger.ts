import type { CharacterCard } from "@tcg/op-types";
import { op13GolDRoger064I18n } from "./064-gol-d-roger.i18n.ts";

export const op13GolDRoger064: CharacterCard = {
  id: "OP13-064",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP13",
  cost: 10,
  power: 13000,
  traits: ["Roger Pirates King of the Pirates"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-064_p1_vix6oRm.jpg",
      imageId: "OP13-064_p1",
    },
  ],
  effect:
    "Your Leader and all of your Characters that do not have a type including \"Roger Pirates\" have their effects negated.\n[On Play] DON!! 3: Your Leader gains +2000 power until the end of your opponent's next End Phase. Then, give all of your opponent's Characters -2000 power until the end of your opponent's next End Phase.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 3,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            value: 2000,
            duration: "untilEndOfOpponentNextEndPhase",
          },
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: "all",
              },
            },
            value: -2000,
            duration: "untilEndOfOpponentNextEndPhase",
          },
        ],
      },
    ],
  },
  i18n: op13GolDRoger064I18n,
};
