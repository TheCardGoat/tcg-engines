import type { CharacterCard } from "@tcg/op-types";
import { op10PortgasDAceTr052I18n } from "./052-portgas-d-ace-tr.i18n.ts";

export const op10PortgasDAceTr052: CharacterCard = {
  id: "OP08-052",
  cardType: "character",
  color: ["blue"],
  rarity: "TR",
  setId: "OP10",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "special",
  effect:
    '[On Play] Reveal 1 card from the top of your deck and play up to 1 Character card with a type including "Whitebeard Pirates" and a cost of 4 or less. Then, place the rest at the top or bottom of your deck.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 1,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 1,
              upTo: true,
            },
            revealDestination: "character",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op10PortgasDAceTr052I18n,
};
