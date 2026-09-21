import type { CharacterCard } from "@tcg/op-types";
import { op15Arlong023I18n } from "./op15-023-arlong.i18n.ts";

export const op15Arlong023: CharacterCard = {
  id: "OP15-023",
  canonicalId: "OP15-023",
  slug: "arlong/op15-023",
  name: "Arlong",
  printings: [
    {
      id: "OP15-023",
      artId: "OP15-023",
      setCode: "OP15",
      collectorNumber: "023",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-023_5PHZDWp.jpg",
    },
    {
      id: "OP15-023_p1",
      artId: "OP15-023",
      setCode: "OP15",
      collectorNumber: "023",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-023_Gw7GOtl.jpg",
      label: "Arlong (Dash Pack)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP15",
  cost: 4,
  power: 5000,
  counter: 1000,
  attribute: "strike",
  traits: ["Fish-Man Arlong Pirates East Blue"],
  effect:
    "[On K.O.] Up to 2 of your opponent's rested cards will not become active in your opponent's next Refresh Phase.\n[Activate: Main] [Once Per Turn] You may give 1 of your opponent's rested DON!! cards to 1 of your opponent's Characters: Give up to 1 DON!! card from its owner's cost area to its owner's Leader or 1 of their Characters.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "freeze",
            target: {
              player: "opponent",
              zones: ["character", "costArea"],
              count: {
                amount: 2,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "activateMain",
        oncePerTurn: true,
        optional: true,
        costs: [
          {
            cost: "giveDon",
            amount: 1,
            donorPlayer: "opponent",
            donState: "rested",
            recipientPlayer: "opponent",
          },
        ],
        actions: [
          {
            action: "giveDon",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donorPlayer: "opponent",
            donState: "any",
          },
        ],
      },
    ],
  },
  i18n: op15Arlong023I18n,
};
