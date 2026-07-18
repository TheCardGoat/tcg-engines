import type { CharacterCard } from "@tcg/op-types";
import { op07Foxy071I18n } from "./071-foxy.i18n.ts";

export const op07Foxy071: CharacterCard = {
  id: "OP07-071",
  canonicalId: "OP07-071",
  slug: "foxy/op07-071",
  name: "Foxy",
  printings: [
    {
      id: "OP07-071",
      artId: "OP07-071",
      setCode: "OP07",
      collectorNumber: "071",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-071.jpg",
    },
    {
      id: "OP07-071_p1",
      artId: "OP07-071_p1",
      setCode: "OP07",
      collectorNumber: "071",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-071_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP07",
  cost: 7,
  power: 7000,
  traits: ["Foxy Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-071_p1.jpg",
      imageId: "OP07-071_p1",
    },
  ],
  effect:
    "[Opponent's Turn] If your Leader has the [Foxy Pirates] type, give all of your opponent's Characters -1000 power. [Activate: Main] [Once Per Turn] Add up to 1 DON!! card from your DON!! deck and rest it.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
        oncePerTurn: true,
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
          {
            condition: "leaderTrait",
            trait: "Foxy Pirates",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: "all",
              },
            },
            value: -1000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op07Foxy071I18n,
};
