import type { CharacterCard } from "@tcg/op-types";
import { op01Arlong063I18n } from "./063-arlong.i18n.ts";

export const op01Arlong063: CharacterCard = {
  id: "OP01-063",
  canonicalId: "OP01-063",
  slug: "arlong/op01-063",
  name: "Arlong",
  printings: [
    {
      id: "OP01-063",
      artId: "OP01-063",
      setCode: "OP01",
      collectorNumber: "063",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-063.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP01",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Fish-Man Arlong Pirates"],
  attribute: "slash",
  effect:
    "[DON!! x1] [Activate:Main] You may rest this Character: Choose 1 card from your opponent's hand; your opponent reveals that card. If the revealed card is an Event, place up to 1 card from your opponent's Life area at the bottom of the owner's deck.  This card has been officially errata'd.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "revealFromHand",
            player: "opponent",
            amount: 1,
            chosenBy: "self",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op01Arlong063I18n,
};
