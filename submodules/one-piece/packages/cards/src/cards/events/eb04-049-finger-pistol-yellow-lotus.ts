import type { EventCard } from "@tcg/op-types";
import { eb04FingerPistolYellowLotus049I18n } from "./eb04-049-finger-pistol-yellow-lotus.i18n.ts";

export const eb04FingerPistolYellowLotus049: EventCard = {
  id: "EB04-049",
  canonicalId: "EB04-049",
  slug: "finger-pistol-yellow-lotus/eb04-049",
  name: "Finger Pistol Yellow Lotus",
  printings: [
    {
      id: "EB04-049",
      artId: "EB04-049",
      setCode: "EB04",
      collectorNumber: "049",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-049_jWXZUjQ.jpg",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "C",
  setId: "EB04",
  cost: 4,
  trigger: "Activate this card's [Main] effect.",
  traits: ["CP9"],
  effect:
    "[Main] You may trash 2 cards from the top of your deck: K.O. up to 1 of your opponent's Characters with a base cost of 5 or less.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "deck",
            comparison: "gte",
            value: 2,
          },
        ],
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
            amount: 2,
          },
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
                  filter: "baseCost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "activateEffect",
            effectTrigger: "main",
          },
        ],
      },
    ],
  },
  i18n: eb04FingerPistolYellowLotus049I18n,
};
