import type { CharacterCard } from "@tcg/op-types";
import { op05DonquixoteRosinante030I18n } from "./030-donquixote-rosinante.i18n.ts";

export const op05DonquixoteRosinante030: CharacterCard = {
  id: "OP05-030",
  canonicalId: "OP05-030",
  slug: "donquixote-rosinante/op05-030",
  name: "Donquixote Rosinante",
  printings: [
    {
      id: "OP05-030",
      artId: "OP05-030",
      setCode: "OP05",
      collectorNumber: "030",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-030.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP05",
  cost: 2,
  power: 1000,
  counter: 1000,
  traits: ["Navy", "Donquixote Pirates"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [Opponent's Turn] If your rested Character would be K.O.'d, you may trash this Character instead.",
  effects: {
    keywords: ["blocker"],
    replacementEffects: [
      {
        replacedEvent: "ko",
        target: {
          player: "self",
          zones: ["character"],
          count: {
            amount: 1,
          },
          filters: [
            {
              filter: "state",
              value: "rested",
            },
          ],
        },
        replacementAction: {
          action: "trashThisCard",
        },
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
      },
    ],
  },
  i18n: op05DonquixoteRosinante030I18n,
};
