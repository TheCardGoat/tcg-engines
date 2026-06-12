import type { CharacterCard } from "@tcg/op-types";
import { op01KurozumiOrochi098I18n } from "./098-kurozumi-orochi.i18n.ts";

export const op01KurozumiOrochi098: CharacterCard = {
  id: "OP01-098",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP01",
  cost: 1,
  power: 2000,
  counter: 2000,
  traits: ["Land of Wano Kurozumi Clan"],
  attribute: "wisdom",
  effect:
    "[On Play] Reveal up to 1 [Artificial Devil Fruit SMILE] from your deck and add it to your hand. Then, shuffle your deck.  This card has been officially errata'd.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 0,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 1,
              upTo: true,
            },
            revealFilters: [
              {
                filter: "name",
                value: "Artificial Devil Fruit SMILE",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op01KurozumiOrochi098I18n,
};
