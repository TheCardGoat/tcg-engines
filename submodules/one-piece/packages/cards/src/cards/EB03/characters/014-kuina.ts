import type { CharacterCard } from "@tcg/op-types";
import { eb03Kuina014I18n } from "./014-kuina.i18n.ts";

export const eb03Kuina014: CharacterCard = {
  id: "EB03-014",
  canonicalId: "EB03-014",
  slug: "kuina/eb03-014",
  name: "Kuina",
  printings: [
    {
      id: "EB03-014",
      artId: "EB03-014",
      setCode: "EB03",
      collectorNumber: "014",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-014_NUWnTjm.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "EB03",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["East Blue Frost Moon Village"],
  attribute: "slash",
  effect:
    '[Activate: Main] You may rest this Character: Give up to 2 rested DON!! cards to your "Slash" attribute Leader.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "attribute",
                  value: "slash",
                },
              ],
            },
            count: {
              amount: 2,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb03Kuina014I18n,
};
