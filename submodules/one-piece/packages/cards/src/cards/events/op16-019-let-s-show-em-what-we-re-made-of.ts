import type { EventCard } from "@tcg/op-types";
import { op16LetSShowEmWhatWeReMadeOf019I18n } from "./op16-019-let-s-show-em-what-we-re-made-of.i18n.ts";

export const op16LetSShowEmWhatWeReMadeOf019: EventCard = {
  id: "OP16-019",
  canonicalId: "OP16-019",
  slug: "let-s-show-em-what-we-re-made-of/op16-019",
  name: "Let's Show 'Em What We're Made Of!!",
  printings: [
    {
      id: "OP16-019",
      artId: "OP16-019",
      setCode: "OP16",
      collectorNumber: "019",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-019_ARyy3x6.jpg",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "OP16",
  cost: 9,
  traits: ["Whitebeard Pirates"],
  effect:
    '[Main] Play up to 2 Character cards with a type including "Whitebeard Pirates" and 8000 power from your hand.  [Trigger] Your Leader gains +1000 power during this turn.',
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 2,
              upTo: true,
            },
          },
        ],
      },
      {
        trigger: "trigger",
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
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op16LetSShowEmWhatWeReMadeOf019I18n,
};
