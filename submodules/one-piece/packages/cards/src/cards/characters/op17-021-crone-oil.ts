import type { CharacterCard } from "@tcg/op-types";
import { op17CroneOil021I18n } from "./op17-021-crone-oil.i18n.ts";

export const op17CroneOil021: CharacterCard = {
  id: "OP17-021",
  canonicalId: "OP17-021",
  slug: "crone-oil/op17-021",
  name: "Crone Oil",
  printings: [
    {
      id: "OP17-021",
      artId: "OP17-021",
      setCode: "OP17",
      collectorNumber: "021",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-021_WkA32g8.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP17",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["Red-Haired Pirates Allies"],
  attribute: "slash",
  effect:
    'If your Character with a type including "Red-Haired Pirates" would be removed from the field by your opponent\'s effect, you may rest 1 of your cards instead.',
  effects: {
    replacementEffects: [
      {
        replacedEvent: "removeFromField",
        target: {
          player: "self",
          zones: ["character"],
          count: {
            amount: 1,
          },
          filters: [
            {
              filter: "trait",
              value: "Red-Haired Pirates",
              match: "includes",
            },
          ],
        },
        source: "opponentEffect",
        replacementAction: {
          action: "rest",
          target: {
            player: "self",
            zones: ["leader", "character", "stage", "costArea"],
            count: {
              amount: 1,
            },
          },
        },
      },
    ],
  },
  i18n: op17CroneOil021I18n,
};
