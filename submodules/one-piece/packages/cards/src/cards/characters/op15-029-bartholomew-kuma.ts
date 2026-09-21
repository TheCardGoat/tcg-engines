import type { CharacterCard } from "@tcg/op-types";
import { op15BartholomewKuma029I18n } from "./op15-029-bartholomew-kuma.i18n.ts";

export const op15BartholomewKuma029: CharacterCard = {
  id: "OP15-029",
  canonicalId: "OP15-029",
  slug: "bartholomew-kuma/op15-029",
  name: "Bartholomew Kuma",
  printings: [
    {
      id: "OP15-029",
      artId: "OP15-029",
      setCode: "OP15",
      collectorNumber: "029",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-029_D4Iav9r.jpg",
      label: "Bartholomew Kuma (OP15-029)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP15",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Revolutionary Army The Seven Warlords of the Sea"],
  attribute: "strike",
  effect:
    "[On Play] Up to 1 of your opponent's Characters with a cost of 5 or less cannot be rested until the end of your opponent's next End Phase.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "cannotBeRested",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
            duration: "untilEndOfOpponentNextEndPhase",
          },
        ],
      },
    ],
  },
  i18n: op15BartholomewKuma029I18n,
};
