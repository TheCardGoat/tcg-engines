import type { StageCard } from "@tcg/op-types";
import { op03GalleyLaCompany075I18n } from "./075-galley-la-company.i18n.ts";

export const op03GalleyLaCompany075: StageCard = {
  id: "OP03-075",
  canonicalId: "OP03-075",
  slug: "galley-la-company",
  name: "Galley-La Company",
  printings: [
    {
      id: "OP03-075",
      artId: "OP03-075",
      setCode: "OP03",
      collectorNumber: "075",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-075.jpg",
    },
  ],
  cardType: "stage",
  color: ["purple"],
  rarity: "C",
  setId: "OP03",
  cost: 3,
  traits: ["Galley-La Company Water Seven"],
  effect:
    "[Activate:Main] You may rest this Stage: If your Leader is [Iceburg], add up to 1 DON!! card from your DON!! deck and rest it.",
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
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
            condition: {
              condition: "leaderName",
              name: "Iceburg",
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op03GalleyLaCompany075I18n,
};
