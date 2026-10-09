import type { CharacterCard } from "@tcg/op-types";
import { pEustassCaptainKid067I18n } from "./p-067-eustass-captain-kid.i18n.ts";
// Official OP07 prerelease image and English Asia cardlist series556901 agree.
export const pEustassCaptainKid067: CharacterCard = {
  id: "P-067",
  canonicalId: "P-067",
  slug: "eustass-captain-kid/p-067",
  name: 'Eustass"Captain"Kid',
  printings: [
    {
      id: "P-067",
      artId: "P-067",
      setCode: "P",
      collectorNumber: "067",
      rarity: "P",
      imageUrl:
        "https://en.onepiece-cardgame.com/images/events/2024/store_tournament_op07/card_01.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "P",
  setId: "P",
  cost: 5,
  power: 6000,
  traits: ["Supernovas", "Kid Pirates"],
  attribute: "special",
  effect:
    'If this Character is rested, your opponent cannot attack any card other than the Character [Eustass"Captain"Kid].',
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "cardState",
            target: "this",
            property: "state",
            comparison: "eq",
            value: "rested",
          },
        ],
        actions: [
          {
            action: "attackRestriction",
            restriction: "cannotAttackOtherThan",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: 1 },
              filters: [{ filter: "name", value: 'Eustass"Captain"Kid' }],
            },
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: pEustassCaptainKid067I18n,
};
