import type { EventCard } from "@tcg/op-types";
import { op12DemonAuraNineSwordStyleAsuraBladesDrawnDeadManSGame037I18n } from "./037-demon-aura-nine-sword-style-asura-blades-drawn-dead-man-s-game.i18n.ts";

export const op12DemonAuraNineSwordStyleAsuraBladesDrawnDeadManSGame037: EventCard = {
  id: "OP12-037",
  cardType: "event",
  color: ["green"],
  rarity: "R",
  setId: "OP12",
  cost: 1,
  traits: ["Straw Hat Crew"],
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-037_p1_h65uZt2.jpg",
      imageId: "OP12-037_p1",
    },
  ],
  effect:
    "[Main] You may rest 3 of your DON!! cards: Rest up to a total of 2 of your opponent's Characters or DON!! cards.\n[Counter] Your Leader gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character", "costArea"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
          },
        ],
        optional: true,
      },
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
  i18n: op12DemonAuraNineSwordStyleAsuraBladesDrawnDeadManSGame037I18n,
};
