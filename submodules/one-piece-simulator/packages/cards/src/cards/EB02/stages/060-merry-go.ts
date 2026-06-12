import type { StageCard } from "@tcg/op-types";
import { eb02MerryGo060I18n } from "./060-merry-go.i18n.ts";

export const eb02MerryGo060: StageCard = {
  id: "EB02-060",
  cardType: "stage",
  color: ["yellow"],
  rarity: "C",
  setId: "EB02",
  cost: 2,
  traits: ["Straw Hat Crew"],
  effect:
    '[Activate: Main] You may rest this Stage and turn 1 card from the top of your Life cards face-up: Up to 1 of your "Straw Hat Crew" type Characters gains +1000 power until the end of your opponent\'s next turn.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
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
            value: 1000,
            duration: "untilEndOfOpponentNextTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb02MerryGo060I18n,
};
