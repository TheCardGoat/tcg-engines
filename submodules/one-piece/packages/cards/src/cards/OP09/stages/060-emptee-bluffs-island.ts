import type { StageCard } from "@tcg/op-types";
import { op09EmpteeBluffsIsland060I18n } from "./060-emptee-bluffs-island.i18n.ts";

export const op09EmpteeBluffsIsland060: StageCard = {
  id: "OP09-060",
  canonicalId: "OP09-060",
  slug: "emptee-bluffs-island",
  name: "Emptee Bluffs Island",
  printings: [
    {
      id: "OP09-060",
      artId: "OP09-060",
      setCode: "OP09",
      collectorNumber: "060",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-060.jpg",
    },
  ],
  cardType: "stage",
  color: ["blue"],
  rarity: "C",
  setId: "OP09",
  cost: 1,
  traits: ["Cross Guild"],
  effect:
    '[Activate: Main] You may place 2 cards from your hand at the bottom of your deck in any order and rest this Stage: If your Leader has the "Cross Guild" type, draw 2 cards.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Cross Guild",
          },
        ],
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op09EmpteeBluffsIsland060I18n,
};
