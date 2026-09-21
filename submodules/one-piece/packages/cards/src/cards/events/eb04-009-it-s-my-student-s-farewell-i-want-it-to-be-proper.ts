import type { EventCard } from "@tcg/op-types";
import { eb04ItSMyStudentSFarewellIWantItToBeProper009I18n } from "./eb04-009-it-s-my-student-s-farewell-i-want-it-to-be-proper.i18n.ts";

export const eb04ItSMyStudentSFarewellIWantItToBeProper009: EventCard = {
  id: "EB04-009",
  canonicalId: "EB04-009",
  slug: "it-s-my-student-s-farewell-i-want-it-to-be-proper/eb04-009",
  name: "It's My Student's Farewell. I Want It to Be Proper.",
  printings: [
    {
      id: "EB04-009",
      artId: "EB04-009",
      setCode: "EB04",
      collectorNumber: "009",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-009_vArQcQJ.jpg",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "EB04",
  cost: 0,
  traits: ["Former Roger Pirates"],
  effect:
    "[Main] You may give 1 active DON!! card to 1 of your [Silvers Rayleigh]: Give up to 1 of your opponent's Characters -2000 power during this turn.[Counter] Up to 1 of your Characters or [Silvers Rayleigh] gains +2000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "giveDon",
            amount: 1,
          },
        ],
        optional: true,
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -2000,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: eb04ItSMyStudentSFarewellIWantItToBeProper009I18n,
};
