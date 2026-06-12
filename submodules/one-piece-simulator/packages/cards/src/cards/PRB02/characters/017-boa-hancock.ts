import type { CharacterCard } from "@tcg/op-types";
import { prb02BoaHancock017I18n } from "./017-boa-hancock.i18n.ts";

export const prb02BoaHancock017: CharacterCard = {
  id: "PRB02-017",
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "PRB02",
  cost: 5,
  power: 7000,
  traits: ["FILM Kuja Pirates The Seven Warlords of the Sea"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/PRB02-017_p1.jpg",
      imageId: "PRB02-017_p1",
    },
  ],
  effect:
    "[Once Per Turn] You may trash 1 card with a [Trigger] from your hand: Your opponent's rested Leader or up to 1 of your opponent's Characters other than [Monkey.D.Luffy] cannot attack until the end of your opponent's next End Phase.[Trigger] K.O up to 1 of your opponent's Characters with a cost of 4 or less",
  effects: {
    effects: [
      {
        trigger: "trigger",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
    permanentEffects: [
      {
        actions: [
          {
            action: "cannotAttack",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "excludeName",
                  value: "Monkey.D.Luffy",
                },
                {
                  filter: "state",
                  value: "rested",
                },
              ],
            },
            duration: "untilEndOfOpponentNextEndPhase",
          },
        ],
      },
    ],
  },
  i18n: prb02BoaHancock017I18n,
};
