import type { CharacterCard } from "@tcg/op-types";
import { st19Hina004I18n } from "./st19-004-hina.i18n.ts";
export const st19Hina004: CharacterCard = {
  id: "ST19-004",
  canonicalId: "ST19-004",
  slug: "hina/st19-004",
  name: "Hina",
  printings: [
    {
      id: "ST19-004",
      artId: "ST19-004",
      setCode: "ST19",
      collectorNumber: "004",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST19-004.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "ST19",
  cost: 4,
  power: 6000,
  traits: ["Navy"],
  attribute: "special",
  effect:
    "[DON!! x1] [Opponent's Turn] This Character gains +4 cost. [Activate: Main] [Once Per Turn] You may place 1 card from your trash at the bottom of your deck: Give up to 1 rested DON!! card to your Leader or 1 of your Characters.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "returnTrashToDeck",
            amount: 1,
            position: "bottom",
          },
        ],
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 4,
          },
        ],
      },
    ],
  },
  i18n: st19Hina004I18n,
};
