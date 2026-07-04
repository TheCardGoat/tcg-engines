import type { CharacterCard } from "@tcg/op-types";
import { prb02ScratchmenApooOp08087PirateFoil087I18n } from "./087-scratchmen-apoo-op08-087-pirate-foil.i18n.ts";

export const prb02ScratchmenApooOp08087PirateFoil087: CharacterCard = {
  id: "OP08-087",
  canonicalId: "OP08-087",
  slug: "scratchmen-apoo-op08-087-pirate-foil",
  name: "Scratchmen Apoo - OP08-087 (Pirate Foil)",
  printings: [
    {
      id: "OP08-087",
      artId: "OP08-087",
      setCode: "PRB02",
      collectorNumber: "087",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-087_p1.jpg",
    },
    {
      id: "OP08-087_r1",
      artId: "OP08-087_r1",
      setCode: "PRB02",
      collectorNumber: "087",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-087_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "PRB02",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates On-Air Pirates"],
  attribute: "ranged",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-087_r1.jpg",
      imageId: "OP08-087_r1",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)[Activate:Main] [Once Per Turn] Give up to 1 of your opponent's Characters 1 cost during this turn.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 1,
            duration: "thisTurn",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: prb02ScratchmenApooOp08087PirateFoil087I18n,
};
