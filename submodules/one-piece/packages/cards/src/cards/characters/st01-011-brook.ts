import type { CharacterCard } from "@tcg/op-types";
import { strawHat } from "../st01-helpers.ts";
import { st01Brook011I18n } from "./st01-011-brook.i18n.ts";

export const st01Brook011: CharacterCard = {
  id: "ST01-011",
  canonicalId: "ST01-011",
  slug: "brook/st01-011",
  name: "Brook",
  printings: [
    {
      id: "ST01-011",
      artId: "ST01-011",
      setCode: "ST01",
      collectorNumber: "011",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-011.jpg",
    },
    {
      id: "ST01-011_p4",
      artId: "ST01-011_p4",
      setCode: "ST01",
      collectorNumber: "011",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-011_p4.jpg",
    },
    {
      id: "ST01-011_r1",
      artId: "ST01-011_r1",
      setCode: "ST01",
      collectorNumber: "011",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-011_r1.jpg",
      label: "Brook - ST01-011 (Reprint)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST01",
  cost: 2,
  power: 3000,
  counter: 2000,
  traits: strawHat,
  attribute: "slash",
  effect: "[On Play] Give up to 2 rested DON!! cards to your Leader or 1 of your Characters.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: { amount: 1 },
            },
            count: { amount: 2, upTo: true },
            donState: "rested",
          },
        ],
      },
    ],
  },
  i18n: st01Brook011I18n,
};
