import type { StageCard } from "@tcg/op-types";
import { op09RedForce021I18n } from "./021-red-force.i18n.ts";

export const op09RedForce021: StageCard = {
  id: "OP09-021",
  canonicalId: "OP09-021",
  slug: "red-force",
  name: "Red Force",
  printings: [
    {
      id: "OP09-021",
      artId: "OP09-021",
      setCode: "OP09",
      collectorNumber: "021",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-021.jpg",
    },
  ],
  cardType: "stage",
  color: ["red"],
  rarity: "C",
  setId: "OP09",
  cost: 2,
  traits: ["Red-Haired Pirates"],
  effect:
    '[Activate: Main] You may rest this Stage: If your Leader has the "Red-Haired Pirates" type, give up to 1 of your opponent\'s Characters -1000 power during this turn.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
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
            value: -1000,
            duration: "thisTurn",
            condition: {
              condition: "leaderTrait",
              trait: "Red-Haired Pirates",
              match: "includes",
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op09RedForce021I18n,
};
