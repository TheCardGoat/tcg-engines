import type { EventCard } from "@tcg/op-types";
import { op17AreYouThatAfraidOfTheNewEra037I18n } from "./op17-037-are-you-that-afraid-of-the-new-era.i18n.ts";

export const op17AreYouThatAfraidOfTheNewEra037: EventCard = {
  id: "OP17-037",
  canonicalId: "OP17-037",
  slug: "are-you-that-afraid-of-the-new-era/op17-037",
  name: "Are You That Afraid of the New Era?!",
  printings: [
    {
      id: "OP17-037",
      artId: "OP17-037",
      setCode: "OP17",
      collectorNumber: "037",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-037_9tYgBFD.jpg",
    },
    {
      id: "OP17-037_p1",
      artId: "OP17-037_p1",
      setCode: "OP17",
      collectorNumber: "037",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-037_p1_VxNp1el.jpg",
      label: "Are You That Afraid of the New Era?! (Alternate Art)",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "R",
  setId: "OP17",
  cost: 1,
  traits: ["The Four Emperors Red-Haired Pirates"],
  effect:
    '[Main] Look at 5 cards from the top of your deck; reveal up to 1 card with a type including "Red-Haired Pirates" and add it to your hand. Then, place the rest at the bottom of your deck in any order.\n[Counter] You may rest 1 of your cards: Up to 1 of your Leader or Characters gains +3000 power during this battle.',
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "search",
            lookCount: 5,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 1,
              upTo: true,
            },
            revealFilters: [
              {
                filter: "trait",
                value: "Red-Haired Pirates",
                match: "includes",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "counter",
        costs: [
          {
            cost: "restCards",
            amount: 1,
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
            value: 3000,
            duration: "thisBattle",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op17AreYouThatAfraidOfTheNewEra037I18n,
};
