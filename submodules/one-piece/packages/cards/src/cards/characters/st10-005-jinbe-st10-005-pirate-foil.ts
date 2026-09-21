import type { CharacterCard } from "@tcg/op-types";
import { prb02JinbeSt10005PirateFoil005I18n } from "./st10-005-jinbe-st10-005-pirate-foil.i18n.ts";

export const prb02JinbeSt10005PirateFoil005: CharacterCard = {
  id: "ST10-005",
  canonicalId: "ST10-005",
  slug: "jinbe-st10-005-pirate-foil",
  name: "Jinbe",
  printings: [
    {
      id: "ST10-005",
      artId: "ST10-005",
      setCode: "ST10",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST10-005_p2.jpg",
      label: "Jinbe - ST10-005 (Pirate Foil)",
    },
    {
      id: "ST10-005_r1",
      artId: "ST10-005_r1",
      setCode: "ST10",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST10-005_r1.jpg",
      label: "Jinbe - ST10-005 (Reprint)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST10",
  cost: 2,
  power: 2000,
  counter: 2000,
  traits: ["Fish-Man Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[DON!! x1] [When Attacking] Give up to 1 of your opponent's Characters -2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
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
      },
    ],
  },
  i18n: prb02JinbeSt10005PirateFoil005I18n,
};
