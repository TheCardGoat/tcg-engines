import type { EventCard } from "@tcg/op-types";
import { st13GumGumJetSpear018I18n } from "./st13-018-gum-gum-jet-spear.i18n.ts";
export const st13GumGumJetSpear018: EventCard = {
  id: "ST13-018",
  canonicalId: "ST13-018",
  slug: "gum-gum-jet-spear/st13-018",
  name: "Gum-Gum Jet Spear",
  printings: [
    {
      id: "ST13-018",
      artId: "ST13-018",
      setCode: "ST13",
      collectorNumber: "018",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST13-018.png",
    },
  ],
  cardType: "event",
  color: ["yellow"],
  rarity: "C",
  setId: "ST13",
  cost: 1,
  traits: ["Punk Hazard", "Straw Hat Crew"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +2000 power during this battle. Then, if you have 0 Life cards, draw 1 card.",
  trigger:
    "You may add 1 card from the top or bottom of your Life cards to your hand: Add up to 1 card from your hand to the top of your Life cards.",
  effects: {
    effects: [
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2000,
            duration: "thisBattle",
          },
          {
            action: "draw",
            player: "self",
            amount: 1,
            condition: {
              condition: "lifeCount",
              player: "self",
              comparison: "eq",
              value: 0,
            },
          },
        ],
      },
      {
        trigger: "trigger",
        costs: [
          {
            cost: "addLifeToHand",
            amount: 1,
            position: "choice",
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            position: "top",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st13GumGumJetSpear018I18n,
};
