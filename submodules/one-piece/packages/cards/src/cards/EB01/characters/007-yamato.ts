import type { CharacterCard } from "@tcg/op-types";
import { eb01Yamato007I18n } from "./007-yamato.i18n.ts";

export const eb01Yamato007: CharacterCard = {
  id: "EB01-007",
  canonicalId: "EB01-007",
  slug: "yamato/eb01-007",
  name: "Yamato",
  printings: [
    {
      id: "EB01-007",
      artId: "EB01-007",
      setCode: "EB01",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-007.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "EB01",
  cost: 5,
  power: 5000,
  counter: 2000,
  traits: ["Land of Wano"],
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
  i18n: eb01Yamato007I18n,
};
