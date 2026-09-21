import type { CharacterCard } from "@tcg/op-types";
import { op17MissBuckinghamStussy054I18n } from "./op17-054-miss-buckingham-stussy.i18n.ts";

export const op17MissBuckinghamStussy054: CharacterCard = {
  id: "OP17-054",
  canonicalId: "OP17-054",
  slug: "miss-buckingham-stussy/op17-054",
  name: "Miss Buckingham Stussy",
  printings: [
    {
      id: "OP17-054",
      artId: "OP17-054",
      setCode: "OP17",
      collectorNumber: "054",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-054_xFEydIt.jpg",
    },
    {
      id: "OP17-054_p1",
      artId: "OP17-054_p1",
      setCode: "OP17",
      collectorNumber: "054",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-054_p1_ybuFotw.jpg",
      label: "Miss Buckingham Stussy (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP17",
  cost: 3,
  power: 5000,
  traits: ["Rocks Pirates"],
  attribute: "wisdom",
  effect:
    "[On Play] Up to 1 of your opponent's Characters with a base cost of 6 or less cannot attack until the end of your opponent's next End Phase.\n[Activate:Main] You may rest 3 of your DON!! cards and this Character: Up to 1 of your opponent's Characters cannot attack until the end of your opponent's next End Phase.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "cannotAttack",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "baseCost",
                  comparison: "lte",
                  value: 6,
                },
              ],
            },
            duration: "untilEndOfOpponentNextEndPhase",
          },
        ],
      },
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restDon",
            amount: 3,
          },
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "cannotAttack",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            duration: "untilEndOfOpponentNextEndPhase",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op17MissBuckinghamStussy054I18n,
};
