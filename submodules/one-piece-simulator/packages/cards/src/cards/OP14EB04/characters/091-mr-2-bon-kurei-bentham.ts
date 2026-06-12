import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Mr2BonKureiBentham091I18n } from "./091-mr-2-bon-kurei-bentham.i18n.ts";

export const op14eb04Mr2BonKureiBentham091: CharacterCard = {
  id: "OP14-091",
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP14EB04",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Baroque Works"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-091_p1_516VxGE.jpg",
      imageId: "OP14-091_p1",
    },
  ],
  effect:
    '[On K.O.] Play up to 1 Character card with a type including "Baroque Works" and a cost of 5 or less other than [Mr.2.Bon.Kurei.(Bentham)] from your hand or trash.',
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: ["hand", "trash"],
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "excludeName",
                value: "Mr.2.Bon.Kurei.(Bentham)",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op14eb04Mr2BonKureiBentham091I18n,
};
