import type { EventCard } from "@tcg/op-types";
import { eb02GumGumGiantPistol021I18n } from "./021-gum-gum-giant-pistol.i18n.ts";

export const eb02GumGumGiantPistol021: EventCard = {
  id: "EB02-021",
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "EB02",
  cost: 3,
  trigger: "Rest up to 1 of your opponent's Characters with a cost of 4 or less.",
  traits: ["Straw Hat Crew Water Seven"],
  effect:
    '[Main] Up to 1 of your "Straw Hat Crew" type Characters gains +6000 power during this turn. Then, the selected Character will not become active in your next Refresh Phase.',
  effects: {
    effects: [
      {
        trigger: "main",
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
              filters: [
                {
                  filter: "trait",
                  value: "Straw Hat Crew",
                },
              ],
            },
            value: 6000,
            duration: "thisTurn",
          },
          {
            action: "freeze",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
          },
        ],
      },
    ],
  },
  i18n: eb02GumGumGiantPistol021I18n,
};
