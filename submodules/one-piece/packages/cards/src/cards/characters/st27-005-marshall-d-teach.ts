import type { CharacterCard } from "@tcg/op-types";
import { st27MarshallDTeach005I18n } from "./st27-005-marshall-d-teach.i18n.ts";

export const st27MarshallDTeach005: CharacterCard = {
  id: "ST27-005",
  canonicalId: "ST27-005",
  slug: "marshall-d-teach/st27-005",
  name: "Marshall.D.Teach",
  printings: [
    {
      id: "ST27-005",
      artId: "ST27-005_p1",
      setCode: "ST27",
      collectorNumber: "005",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST27-005_p1.jpg",
      label: "Marshall.D.Teach (ST27-005) (SP)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "ST27",
  cost: 7,
  power: 8000,
  traits: ["Blackbeard Pirates The Four Emperors"],
  attribute: "special",
  effect:
    "[Activate:Main] You may rest this Character: K.O. up to 1 Character with a cost of 3 or less.[On K.O.] Add up to 1 black card from your trash to your hand.",
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
            action: "ko",
            target: {
              player: "any",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st27MarshallDTeach005I18n,
};
