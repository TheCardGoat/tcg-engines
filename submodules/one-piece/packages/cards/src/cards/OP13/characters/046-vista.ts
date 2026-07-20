import type { CharacterCard } from "@tcg/op-types";
import { op13Vista046I18n } from "./046-vista.i18n.ts";

export const op13Vista046: CharacterCard = {
  id: "OP13-046",
  canonicalId: "OP13-046",
  slug: "vista/op13-046",
  name: "Vista",
  printings: [
    {
      id: "OP13-046",
      artId: "OP13-046",
      setCode: "OP13",
      collectorNumber: "046",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-046_gsKHqVM.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP13",
  cost: 6,
  power: 8000,
  traits: ["Whitebeard Pirates"],
  attribute: "slash",
  effect:
    "[Double Attack]\n[Once Per Turn] If this Character would be K.O.'d or would be removed from the field by your opponent's effect, you may trash 1 card with a type including \"Whitebeard Pirates\" from your hand instead.",
  effects: {
    keywords: ["doubleAttack"],
    replacementEffects: [
      {
        replacedEvent: "ko",
        eventFilter: {
          targetSelf: true,
        },
        replacementAction: {
          action: "trashFromHand",
          player: "self",
          amount: 1,
          filters: [
            {
              filter: "trait",
              value: "Whitebeard Pirates",
              match: "includes",
            },
          ],
        },
        oncePerTurn: true,
        oncePerTurnKey: "printed-replacement-0",
      },
      {
        replacedEvent: "removeFromField",
        source: "opponentEffect",
        eventFilter: {
          targetSelf: true,
        },
        replacementAction: {
          action: "trashFromHand",
          player: "self",
          amount: 1,
          filters: [
            {
              filter: "trait",
              value: "Whitebeard Pirates",
              match: "includes",
            },
          ],
        },
        oncePerTurn: true,
        oncePerTurnKey: "printed-replacement-0",
      },
    ],
  },
  i18n: op13Vista046I18n,
};
