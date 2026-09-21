import type { CharacterCard } from "@tcg/op-types";
import { op17NicoRobin087I18n } from "./op17-087-nico-robin.i18n.ts";

export const op17NicoRobin087: CharacterCard = {
  id: "OP17-087",
  canonicalId: "OP17-087",
  slug: "nico-robin/op17-087",
  name: "Nico Robin",
  printings: [
    {
      id: "OP17-087",
      artId: "OP17-087",
      setCode: "OP17",
      collectorNumber: "087",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-087_SEvUdS3.jpg",
    },
    {
      id: "OP17-087_p1",
      artId: "OP17-087_p1",
      setCode: "OP17",
      collectorNumber: "087",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-087_p1_OMnxKwP.jpg",
      label: "Nico Robin (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP17",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Straw Hat Crew Elbaph"],
  attribute: "strike",
  effect:
    "If there is a Character with a cost of 12 or more, this Character gains +3000 power. [On Play] If there is a Character with a cost of 12 or more, give up to 1 of your opponent's Characters -3000 poser during this turn.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "existsOnField",
            zone: "character",
            filters: [
              {
                filter: "cost",
                comparison: "gte",
                value: 12,
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 3000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op17NicoRobin087I18n,
};
