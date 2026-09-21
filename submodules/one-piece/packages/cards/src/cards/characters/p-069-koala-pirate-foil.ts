import type { CharacterCard } from "@tcg/op-types";
import { prb02KoalaPirateFoil069I18n } from "./p-069-koala-pirate-foil.i18n.ts";

export const prb02KoalaPirateFoil069: CharacterCard = {
  id: "P-069",
  canonicalId: "P-069",
  slug: "koala-pirate-foil",
  name: "Koala",
  printings: [
    {
      id: "P-069",
      artId: "P-069",
      setCode: "P",
      collectorNumber: "069",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-069_p3.jpg",
      label: "Koala (Pirate Foil)",
    },
    {
      id: "P-069_r1",
      artId: "P-069_r1",
      setCode: "P",
      collectorNumber: "069",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-069_r1.jpg",
      label: "Koala (Reprint)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "P",
  setId: "P",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Revolutionary Army"],
  attribute: "strike",
  effect:
    "[Activate:Main] [Once Per Turn] Give up to 1 rested DON!! card to your Leader or 1 of your Characters.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
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
  i18n: prb02KoalaPirateFoil069I18n,
};
