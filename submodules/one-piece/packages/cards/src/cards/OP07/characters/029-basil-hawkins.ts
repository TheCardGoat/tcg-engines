import type { CharacterCard } from "@tcg/op-types";
import { op07BasilHawkins029I18n } from "./029-basil-hawkins.i18n.ts";

export const op07BasilHawkins029: CharacterCard = {
  id: "OP07-029",
  canonicalId: "OP07-029",
  slug: "basil-hawkins/op07-029",
  name: "Basil Hawkins",
  printings: [
    {
      id: "OP07-029",
      artId: "OP07-029",
      setCode: "OP07",
      collectorNumber: "029",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-029.jpg",
    },
    {
      id: "OP07-029_p1",
      artId: "OP07-029_p1",
      setCode: "OP07",
      collectorNumber: "029",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-029_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "OP07",
  cost: 6,
  power: 7000,
  traits: ["Hawkins Pirates Supernovas"],
  attribute: "slash",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-029_p1.jpg",
      imageId: "OP07-029_p1",
    },
  ],
  effect:
    "If your Leader has the [Supernovas] type, this Character gains [Blocker]. (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [Once Per Turn] If this Character would be removed from the field by your opponent's effect, you may rest 1 of your opponent's Characters instead.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Supernovas",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: 1 },
              self: true,
            },
            keyword: "blocker",
            duration: "permanent",
          },
        ],
      },
    ],
    replacementEffects: [
      {
        replacedEvent: "removeFromField",
        source: "opponentEffect",
        eventFilter: { targetSelf: true },
        replacementAction: {
          action: "rest",
          target: {
            player: "opponent",
            zones: ["character"],
            count: {
              amount: 1,
            },
          },
        },
        oncePerTurn: true,
      },
    ],
  },
  i18n: op07BasilHawkins029I18n,
};
