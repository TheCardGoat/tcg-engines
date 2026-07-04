import type { EventCard } from "@tcg/op-types";
import { eb03ButIfWeEverSeeEachOtherAgainWillYouCallMeYourShipmate011I18n } from "./011-but-if-we-ever-see-each-other-again-will-you-call-me-your-shipmate.i18n.ts";

export const eb03ButIfWeEverSeeEachOtherAgainWillYouCallMeYourShipmate011: EventCard = {
  id: "EB03-011",
  canonicalId: "EB03-011",
  slug: "but-if-we-ever-see-each-other-again-will-you-call-me-your-shipmate",
  name: "But If We Ever See Each Other Again... Will You Call Me Your Shipmate?!!",
  printings: [
    {
      id: "EB03-011",
      artId: "EB03-011",
      setCode: "EB03",
      collectorNumber: "011",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-011_NTLqies.jpg",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "EB03",
  cost: 1,
  trigger: "Give up to 1 of your opponent's Characters 2000 power during this turn.",
  traits: ["Alabasta"],
  effect:
    "[Counter] If your Leader is [Nefeltari Vivi], up to 1 of your Leader or Character cards gains +4000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "counter",
        conditions: [
          {
            condition: "leaderName",
            name: "Nefeltari Vivi",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 4000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: eb03ButIfWeEverSeeEachOtherAgainWillYouCallMeYourShipmate011I18n,
};
