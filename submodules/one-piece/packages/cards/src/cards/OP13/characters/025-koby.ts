import type { CharacterCard } from "@tcg/op-types";
import { op13Koby025I18n } from "./025-koby.i18n.ts";

export const op13Koby025: CharacterCard = {
  id: "OP13-025",
  canonicalId: "OP13-025",
  slug: "koby/op13-025",
  name: "Koby",
  printings: [
    {
      id: "OP13-025",
      artId: "OP13-025",
      setCode: "OP13",
      collectorNumber: "025",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-025_JEY4yj2.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP13",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["FILM Navy"],
  attribute: "strike",
  effect:
    '[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On Play] If your Leader has the "FILM" type or the "Strike" attribute, set up to 1 of your DON!! cards as active.',
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "compound",
            operator: "or",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "FILM",
                match: "includes",
              },
              {
                condition: "leaderAttribute",
                attribute: "strike",
              },
            ],
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: op13Koby025I18n,
};
