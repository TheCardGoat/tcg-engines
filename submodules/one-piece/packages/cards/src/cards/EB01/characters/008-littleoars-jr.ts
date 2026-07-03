import type { CharacterCard } from "@tcg/op-types";
import { eb01LittleoarsJr008I18n } from "./008-littleoars-jr.i18n.ts";

export const eb01LittleoarsJr008: CharacterCard = {
  id: "EB01-008",
  canonicalId: "EB01-008",
  slug: "littleoars-jr/eb01-008",
  name: "LittleOars Jr.",
  printings: [
    {
      id: "EB01-008",
      artId: "EB01-008",
      setCode: "EB01",
      collectorNumber: "008",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-008.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "EB01",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["Giant Whitebeard Pirates Allies"],
  attribute: "strike",
  effect:
    "[Once Per Turn] If this Character would be K.O.'d by an effect, you may trash 1 Event or Stage card from your hand instead.",
  effects: {
    replacementEffects: [
      {
        replacedEvent: "ko",
        replacementAction: {
          action: "trashFromHand",
          player: "self",
          amount: 1,
          filters: [
            {
              filter: "cardCategory",
              value: "event",
            },
            {
              filter: "cardCategory",
              value: "stage",
            },
          ],
        },
        oncePerTurn: true,
      },
    ],
  },
  i18n: eb01LittleoarsJr008I18n,
};
