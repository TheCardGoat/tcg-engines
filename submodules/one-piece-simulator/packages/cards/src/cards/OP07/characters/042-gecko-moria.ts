import type { CharacterCard } from "@tcg/op-types";
import { op07GeckoMoria042I18n } from "./042-gecko-moria.i18n.ts";

export const op07GeckoMoria042: CharacterCard = {
  id: "OP07-042",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP07",
  cost: 5,
  power: 6000,
  traits: ["The Seven Warlords of the Sea Thriller Bark Pirates"],
  attribute: "special",
  effect:
    "[Once Per Turn] If your Leader has the [The Seven Warlords of the Sea] type and this Character would be removed from the field by your opponent's effect, you may place 1 of your Characters other than [Gecko Moria] at the bottom of the owner's deck instead.",
  effects: {
    replacementEffects: [
      {
        replacedEvent: "removeFromField",
        replacementAction: {
          action: "returnToDeck",
          target: {
            player: "self",
            zones: ["character"],
            count: {
              amount: 1,
            },
            filters: [
              {
                filter: "excludeName",
                value: "Gecko Moria",
              },
            ],
          },
          position: "bottom",
        },
        conditions: [
          {
            condition: "leaderTrait",
            trait: "The Seven Warlords of the Sea",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op07GeckoMoria042I18n,
};
