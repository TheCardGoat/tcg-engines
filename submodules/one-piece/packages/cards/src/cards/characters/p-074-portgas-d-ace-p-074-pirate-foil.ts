import type { CharacterCard } from "@tcg/op-types";
import { prb02PortgasDAceP074PirateFoil074I18n } from "./p-074-portgas-d-ace-p-074-pirate-foil.i18n.ts";

export const prb02PortgasDAceP074PirateFoil074: CharacterCard = {
  id: "P-074",
  canonicalId: "P-074",
  slug: "portgas-d-ace-p-074-pirate-foil",
  name: "Portgas.D.Ace",
  printings: [
    {
      id: "P-074",
      artId: "P-074",
      setCode: "P",
      collectorNumber: "074",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-074_r1_oFjlIxa.jpg",
      label: "Portgas.D.Ace - P-074 (Pirate Foil)",
    },
    {
      id: "P-074_r1",
      artId: "P-074_r1",
      setCode: "P",
      collectorNumber: "074",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-074_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "P",
  setId: "P",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "special",
  effect:
    "[Activate:Main] You may return this Character to the owner's hand: Look at 5 cards from the top of your deck and place them as the top or bottom of the deck in any order.Disclaimer: This card was reprinted from the original set with a different border (Note: the original print had a full art border).",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "returnThisToHand",
          },
        ],
        actions: [
          {
            action: "rearrangeDeck",
            player: "self",
            count: 5,
            position: "topOrBottom",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: prb02PortgasDAceP074PirateFoil074I18n,
};
