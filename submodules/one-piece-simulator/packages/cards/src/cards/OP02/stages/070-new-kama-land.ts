import type { StageCard } from "@tcg/op-types";
import { op02NewKamaLand070I18n } from "./070-new-kama-land.i18n.ts";

export const op02NewKamaLand070: StageCard = {
  id: "OP02-070",
  cardType: "stage",
  color: ["blue"],
  rarity: "C",
  setId: "OP02",
  cost: 1,
  traits: ["Impel Down"],
  effect:
    "[Activate:Main] You may rest this Stage: If your Leader is [Emporio.Ivankov], draw 1 card and trash 1 card from your hand. Then, trash up to 3 cards from your hand.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "leaderName",
            name: "Emporio.Ivankov",
          },
        ],
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op02NewKamaLand070I18n,
};
