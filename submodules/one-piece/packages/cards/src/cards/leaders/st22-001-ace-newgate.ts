import type { LeaderCard } from "@tcg/op-types";
import { st22AceNewgate001I18n } from "./st22-001-ace-newgate.i18n.ts";
export const st22AceNewgate001: LeaderCard = {
  id: "ST22-001",
  canonicalId: "ST22-001",
  slug: "ace-newgate/st22-001",
  name: "Ace & Newgate",
  printings: [
    {
      id: "ST22-001",
      artId: "ST22-001",
      setCode: "ST22",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST22-001.png",
    },
  ],
  cardType: "leader",
  color: ["blue"],
  rarity: "L",
  setId: "ST22",
  traits: ["The Four Emperors", "Whitebeard Pirates"],
  life: 5,
  power: 5000,
  attribute: "special",
  effect:
    '[Activate: Main] [Once Per Turn] You may reveal 1 card with a type including "Whitebeard Pirates" from your hand: Draw 1 card and place the revealed card at the top of your deck.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "revealFromHand",
            amount: 1,
            filters: [
              {
                filter: "trait",
                value: "Whitebeard Pirates",
                match: "includes",
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "returnToDeck",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 1,
              },
            },
            position: "top",
            costPaymentTargets: true,
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: st22AceNewgate001I18n,
};
