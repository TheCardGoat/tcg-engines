import type { CharacterCard } from "@tcg/op-types";
import { prb02DonquixoteRosinanteReprint030I18n } from "./030-donquixote-rosinante-reprint.i18n.ts";

export const prb02DonquixoteRosinanteReprint030: CharacterCard = {
  id: "OP05-030",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "PRB02",
  cost: 2,
  power: 1000,
  traits: ["Donquixote Pirates Navy"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-030_p1.jpg",
      imageId: "OP05-030_p1",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)[Opponent's Turn] If your rested Character would be K.O.'d, you may trash this Character instead.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include \"EN\" at the end of the copyright) and the Artist Credit (Note: there is no pencil design on top of the artist name).",
  effects: {
    keywords: ["blocker"],
    replacementEffects: [
      {
        replacedEvent: "ko",
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
  i18n: prb02DonquixoteRosinanteReprint030I18n,
};
