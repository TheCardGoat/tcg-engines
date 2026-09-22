import type { EventCard } from "@tcg/op-types";
import { op17KundaliDragonSwarm077I18n } from "./op17-077-kundali-dragon-swarm.i18n.ts";

export const op17KundaliDragonSwarm077: EventCard = {
  id: "OP17-077",
  canonicalId: "OP17-077",
  slug: "kundali-dragon-swarm/op17-077",
  name: "Kundali Dragon Swarm",
  printings: [
    {
      id: "OP17-077",
      artId: "OP17-077",
      setCode: "OP17",
      collectorNumber: "077",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-077_b887YP1.jpg",
    },
  ],
  cardType: "event",
  color: ["purple"],
  rarity: "UC",
  setId: "OP17",
  cost: 1,
  traits: ["The Four Emperors Animal Kingdom Pirates"],
  effect:
    "[Main] You may rest 3 of your DON!! cards and trash 2 cards from your hand: If your Leader has the {Animal Kingdom Pirates} type, add up to 3 DON!! cards as rested from your DON!! deck.\n[Counter] DON!! -1: Your Leader gains +4000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "restDon",
            amount: 3,
          },
          {
            cost: "trashFromHand",
            amount: 2,
          },
        ],
        optional: true,
        actions: [
          {
            action: "addDon",
            count: {
              amount: 3,
              upTo: true,
            },
            state: "rested",
          },
        ],
      },
      {
        trigger: "counter",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            value: 4000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op17KundaliDragonSwarm077I18n,
};
