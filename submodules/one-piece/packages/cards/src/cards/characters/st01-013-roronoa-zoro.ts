import type { CharacterCard } from "@tcg/op-types";
import { printing, supernovasStrawHat } from "../st01-helpers.ts";
import { st01RoronoaZoro013I18n } from "./st01-013-roronoa-zoro.i18n.ts";

export const st01RoronoaZoro013: CharacterCard = {
  id: "ST01-013",
  canonicalId: "ST01-013",
  slug: "roronoa-zoro/st01-013",
  name: "Roronoa Zoro",
  printings: [printing("ST01-013", "SR")],
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "ST01",
  cost: 3,
  power: 5000,
  traits: supernovasStrawHat,
  attribute: "slash",
  effect: "[DON!! x1] This Character gains +1000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [{ condition: "donAttached", amount: 1 }],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: 1 },
              self: true,
            },
            value: 1000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: st01RoronoaZoro013I18n,
};
