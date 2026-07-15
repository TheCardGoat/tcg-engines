import type { EventCard } from "@tcg/op-types";
import { eb03ThanksForTheTreat038I18n } from "./038-thanks-for-the-treat.i18n.ts";

export const eb03ThanksForTheTreat038: EventCard = {
  id: "EB03-038",
  canonicalId: "EB03-038",
  slug: "thanks-for-the-treat",
  name: "Thanks for the Treat.",
  printings: [
    {
      id: "EB03-038",
      artId: "EB03-038",
      setCode: "EB03",
      collectorNumber: "038",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-038_LFQPkCS.jpg",
    },
  ],
  cardType: "event",
  color: ["purple"],
  rarity: "C",
  setId: "EB03",
  cost: 1,
  traits: ["The Vinsmoke Family GERMA 66"],
  effect:
    '[Main] You may rest 1 of your DON!! cards: If the number of DON!! cards on your field is equal to or less than the number on your opponent\'s field and you only have Characters with a type including "GERMA", add up to 2 DON!! cards from your DON!! deck and rest them. [Counter] Your Leader gains +3000 power during this battle.',
  effects: {
    effects: [
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            value: 3000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: eb03ThanksForTheTreat038I18n,
};
