import type { CharacterCard } from "@tcg/op-types";
import { op01BartholomewKuma074I18n } from "./074-bartholomew-kuma.i18n.ts";

export const op01BartholomewKuma074: CharacterCard = {
  id: "OP01-074",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP01",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Revolutionary Army The Seven Warlords of the Sea"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On K.O.] Play up to 1 [Pacifista] with a cost of 4 or less from your hand.  This card has been officially errata'd.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "lte",
                value: 4,
              },
              {
                filter: "name",
                value: "Pacifista",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op01BartholomewKuma074I18n,
};
