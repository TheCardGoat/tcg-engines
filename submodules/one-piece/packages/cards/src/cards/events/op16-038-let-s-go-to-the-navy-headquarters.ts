import type { EventCard } from "@tcg/op-types";
import { op16LetSGoToTheNavyHeadquarters038I18n } from "./op16-038-let-s-go-to-the-navy-headquarters.i18n.ts";

export const op16LetSGoToTheNavyHeadquarters038: EventCard = {
  id: "OP16-038",
  canonicalId: "OP16-038",
  slug: "let-s-go-to-the-navy-headquarters/op16-038",
  name: "Let's Go!! To the Navy Headquarters..",
  printings: [
    {
      id: "OP16-038",
      artId: "OP16-038",
      setCode: "OP16",
      collectorNumber: "038",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-038_l9fSdDS.jpg",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "R",
  setId: "OP16",
  cost: 1,
  traits: ["Straw Hat Crew Impel Down"],
  effect:
    "[Main] You may rest 6 of your DON!! cards: If you have 5 {Impel Down} type Characters with different card names, set your Leader and all of your Characters as active.\n\n[Counter] Your Leader gains +3000 power during this battle.",
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
  i18n: op16LetSGoToTheNavyHeadquarters038I18n,
};
