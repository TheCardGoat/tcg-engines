import type { CharacterCard } from "@tcg/op-types";
import { op13MonkeyDDragon017I18n } from "./017-monkey-d-dragon.i18n.ts";

export const op13MonkeyDDragon017: CharacterCard = {
  id: "OP13-017",
  canonicalId: "OP13-017",
  slug: "monkey-d-dragon/op13-017",
  name: "Monkey.D.Dragon",
  printings: [
    {
      id: "OP13-017",
      artId: "OP13-017",
      setCode: "OP13",
      collectorNumber: "017",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-017_b2nvh5F.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP13",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["Revolutionary Army"],
  attribute: "special",
  effect:
    '[Once Per Turn] If your "Revolutionary Army" type Character would be removed from the field by your opponent\'s effect, you may give this Character 2000 power during this turn instead.',
  effects: {
    replacementEffects: [
      {
        replacedEvent: "removeFromField",
        replacementAction: {
          action: "modifyPower",
          target: {
            player: "self",
            zones: ["character"],
            count: {
              amount: 1,
            },
            self: true,
          },
          value: 2000,
          duration: "thisTurn",
        },
        oncePerTurn: true,
      },
    ],
  },
  i18n: op13MonkeyDDragon017I18n,
};
