import type { LeaderCard } from "@tcg/op-types";
import { st10TrafalgarLaw001I18n } from "./st10-001-trafalgar-law.i18n.ts";

export const st10TrafalgarLaw001: LeaderCard = {
  id: "ST10-001",
  canonicalId: "ST10-001",
  slug: "trafalgar-law/st10-001",
  name: "Trafalgar Law",
  printings: [
    {
      id: "ST10-001",
      artId: "ST10-001",
      setCode: "ST10",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST10-001.png",
    },
  ],
  cardType: "leader",
  color: ["red", "purple"],
  rarity: "L",
  setId: "ST10",
  power: 5000,
  life: 4,
  traits: ["Heart Pirates"],
  attribute: "slash",
  effect:
    "[Activate: Main] [Once Per Turn] DON!! −3 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Place up to 1 of your opponent's Characters with 3000 power or less at the bottom of the owner's deck, and play up to 1 Character card with a cost of 4 or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        oncePerTurn: true,
        optional: true,
        costs: [{ cost: "returnDon", amount: 3 }],
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
              filters: [{ filter: "power", comparison: "lte", value: 3000 }],
            },
            position: "bottom",
          },
          {
            action: "play",
            source: { player: "self", zone: "hand" },
            count: { amount: 1, upTo: true },
            filters: [{ filter: "cost", comparison: "lte", value: 4 }],
          },
        ],
      },
    ],
  },
  i18n: st10TrafalgarLaw001I18n,
};
