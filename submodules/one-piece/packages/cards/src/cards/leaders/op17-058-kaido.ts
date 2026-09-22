import type { LeaderCard } from "@tcg/op-types";
import { op17Kaido058I18n } from "./op17-058-kaido.i18n.ts";

export const op17Kaido058: LeaderCard = {
  id: "OP17-058",
  canonicalId: "OP17-058",
  slug: "kaido/op17-058",
  name: "Kaido",
  printings: [
    {
      id: "OP17-058",
      artId: "OP17-058",
      setCode: "OP17",
      collectorNumber: "058",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-058_k1KlLgx.jpg",
      label: "Kaido (058)",
    },
    {
      id: "OP17-058_p1",
      artId: "OP17-058_p1",
      setCode: "OP17",
      collectorNumber: "058",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-058_p1_k8aXX6o.jpg",
      label: "Kaido (058) (Alternate Art)",
    },
  ],
  cardType: "leader",
  color: ["purple"],
  rarity: "L",
  setId: "OP17",
  power: 5000,
  life: 5,
  traits: ["Animal Kingdom Pirates The Four Emperors"],
  attribute: "special",
  effect:
    "[When Attacking]/[On Your Opponent's Attack] [Once Per Turn] DON!! -1: Give up to 1 of your opponent's Characters -2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
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
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -2000,
            duration: "thisTurn",
          },
        ],
        optional: true,
        oncePerTurn: true,
        oncePerTurnKey:
          "shared:whenAttacking|onOpponentAttack:give up to 1 of your opponent's characters -2000 power during this turn.",
      },
      {
        trigger: "onOpponentAttack",
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
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -2000,
            duration: "thisTurn",
          },
        ],
        optional: true,
        oncePerTurn: true,
        oncePerTurnKey:
          "shared:whenAttacking|onOpponentAttack:give up to 1 of your opponent's characters -2000 power during this turn.",
      },
    ],
  },
  i18n: op17Kaido058I18n,
};
