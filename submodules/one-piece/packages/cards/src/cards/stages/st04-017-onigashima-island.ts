import type { StageCard } from "@tcg/op-types";
import { st04OnigashimaIsland017I18n } from "./st04-017-onigashima-island.i18n.ts";

export const st04OnigashimaIsland017: StageCard = {
  id: "ST04-017",
  canonicalId: "ST04-017",
  slug: "onigashima-island/st04-017",
  name: "Onigashima Island",
  printings: [
    {
      id: "ST04-017",
      artId: "ST04-017",
      setCode: "ST04",
      collectorNumber: "017",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST04-017.png",
    },
  ],
  cardType: "stage",
  color: ["purple"],
  rarity: "C",
  setId: "ST04",
  cost: 3,
  traits: ["Animal Kingdom Pirates"],
  effect:
    "[Activate: Main] You may rest this Stage: If your Leader has the {Animal Kingdom Pirates} type, add up to 1 DON!! card from your DON!! deck and rest it.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        optional: true,
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
            condition: {
              condition: "leaderTrait",
              trait: "Animal Kingdom Pirates",
              match: "exact",
            },
          },
        ],
      },
    ],
  },
  i18n: st04OnigashimaIsland017I18n,
};
