import type { CharacterCard } from "@tcg/op-types";
import { op16PortgasDAce094I18n } from "./op16-094-portgas-d-ace.i18n.ts";

export const op16PortgasDAce094: CharacterCard = {
  id: "OP16-094",
  canonicalId: "OP16-094",
  slug: "portgas-d-ace/op16-094",
  name: "Portgas.D.Ace",
  printings: [
    {
      id: "OP16-094",
      artId: "OP16-094",
      setCode: "OP16",
      collectorNumber: "094",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-094_u87ACT9.jpg",
      label: "Portgas.D.Ace (094)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP16",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Land of Wano Spade Pirates"],
  attribute: "special",
  effect:
    "[On K.O.] Your opponent trashes 2 cards from their hand.\n[Activate: Main] [Once Per Turn] Give up to 1 rested DON!! card to 1 of your {Land of Wano} type Leader or Character cards.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "trashFromHand",
            player: "opponent",
            amount: 2,
          },
        ],
      },
      {
        trigger: "activateMain",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Land of Wano",
                  match: "includes",
                },
              ],
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op16PortgasDAce094I18n,
};
