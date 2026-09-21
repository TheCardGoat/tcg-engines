import type { CharacterCard } from "@tcg/op-types";
import { prb02MonkeyDLuffySt16005PirateFoil005I18n } from "./st16-005-monkey-d-luffy-st16-005-pirate-foil.i18n.ts";

export const prb02MonkeyDLuffySt16005PirateFoil005: CharacterCard = {
  id: "ST16-005",
  canonicalId: "ST16-005",
  slug: "monkey-d-luffy-st16-005-pirate-foil",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "ST16-005",
      artId: "ST16-005",
      setCode: "ST16",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST16-005_p1.jpg",
      label: "Monkey.D.Luffy - ST16-005 (Pirate Foil)",
    },
    {
      id: "ST16-005_r1",
      artId: "ST16-005_r1",
      setCode: "ST16",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST16-005_r1.jpg",
      label: "Monkey.D.Luffy - ST16-005 (Reprint)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "ST16",
  cost: 2,
  power: 3000,
  counter: 2000,
  traits: ["FILM Straw Hat Crew Supernovas"],
  attribute: "strike",
  effect: "If you have a rested [Uta], this Character gains +1000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "hasCard",
            player: "self",
            zone: "character",
            filters: [
              {
                filter: "state",
                value: "rested",
              },
              {
                filter: "name",
                value: "Uta",
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
            value: 1000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: prb02MonkeyDLuffySt16005PirateFoil005I18n,
};
