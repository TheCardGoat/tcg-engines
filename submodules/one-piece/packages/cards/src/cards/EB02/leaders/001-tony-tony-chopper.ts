import type { LeaderCard } from "@tcg/op-types";
import { eb02TonyTonyChopper001I18n } from "./001-tony-tony-chopper.i18n.ts";

export const eb02TonyTonyChopper001: LeaderCard = {
  id: "OP08-001",
  canonicalId: "OP08-001",
  slug: "tony-tony-chopper/op08-001",
  name: "Tony Tony.Chopper",
  printings: [
    {
      id: "OP08-001",
      artId: "OP08-001",
      setCode: "EB02",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-001_txo981N.jpg",
    },
  ],
  cardType: "leader",
  color: ["green", "red"],
  rarity: "L",
  setId: "EB02",
  power: 5000,
  life: 4,
  traits: ["Animal Straw Hat Crew Drum Kingdom"],
  attribute: "strike",
  effect:
    '[Activate: Main] [Once Per Turn] Give up to 3 of your "Animal" or "Drum Kingdom" type Characters up to 1 rested DON!! card each.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 3,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Animal",
                },
                {
                  filter: "trait",
                  value: "Drum Kingdom",
                },
              ],
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: eb02TonyTonyChopper001I18n,
};
