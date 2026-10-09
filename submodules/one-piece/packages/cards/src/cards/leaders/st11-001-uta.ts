import type { LeaderCard } from "@tcg/op-types";
import { st11Uta001I18n } from "./st11-001-uta.i18n.ts";
export const st11Uta001: LeaderCard = {
  id: "ST11-001",
  canonicalId: "ST11-001",
  slug: "uta/st11-001",
  name: "Uta",
  printings: [
    {
      id: "ST11-001",
      artId: "ST11-001",
      setCode: "ST11",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST11-001.png",
    },
  ],
  cardType: "leader",
  color: ["green"],
  rarity: "L",
  setId: "ST11",
  traits: ["FILM"],
  life: 5,
  power: 5000,
  attribute: "special",
  effect:
    "[DON!! x1] [When Attacking] [Once Per Turn] Reveal 1 card from the top of your deck and add up to 1 {FILM} type card to your hand. Then, place the rest at the bottom of your deck.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        oncePerTurn: true,
        actions: [
          {
            action: "revealTopDeckCard",
            player: "self",
            finalPosition: "bottom",
            conditional: {
              filters: [
                {
                  filter: "trait",
                  value: "FILM",
                  match: "exact",
                },
              ],
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
                  revealFilters: [
                    {
                      filter: "trait",
                      value: "FILM",
                      match: "exact",
                    },
                  ],
                  revealDestination: "hand",
                  remainderPosition: "bottom",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: st11Uta001I18n,
};
