import type { EventCard } from "@tcg/op-types";
import { st04LeadPerformerDisaster014I18n } from "./st04-014-lead-performer-disaster.i18n.ts";

export const st04LeadPerformerDisaster014: EventCard = {
  id: "ST04-014",
  canonicalId: "ST04-014",
  slug: "lead-performer-disaster/st04-014",
  name: 'Lead Performer "Disaster"',
  printings: [
    {
      id: "ST04-014",
      artId: "ST04-014",
      setCode: "ST04",
      collectorNumber: "014",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST04-014.png",
    },
  ],
  cardType: "event",
  color: ["purple"],
  rarity: "C",
  setId: "ST04",
  cost: 4,
  traits: ["Animal Kingdom Pirates"],
  effect:
    "[Main] Draw 1 card, then add up to 1 DON!! card from your DON!! deck and set it as active.",
  trigger: "[Trigger] Activate this card's [Main] effect.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
      },
    ],
  },
  i18n: st04LeadPerformerDisaster014I18n,
};
