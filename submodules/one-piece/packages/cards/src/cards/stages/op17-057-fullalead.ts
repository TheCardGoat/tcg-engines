import type { StageCard } from "@tcg/op-types";
import { op17Fullalead057I18n } from "./op17-057-fullalead.i18n.ts";

export const op17Fullalead057: StageCard = {
  id: "OP17-057",
  canonicalId: "OP17-057",
  slug: "fullalead/op17-057",
  name: "Fullalead",
  printings: [
    {
      id: "OP17-057",
      artId: "OP17-057",
      setCode: "OP17",
      collectorNumber: "057",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-057_oyCKHiG.jpg",
    },
  ],
  cardType: "stage",
  color: ["blue"],
  rarity: "C",
  setId: "OP17",
  cost: 1,
  traits: ["Rocks Pirates"],
  effect:
    '[On Your Opponent\'s Attack] You may rest this Stage and trash 1 card from your hand: Up to 1 of your Leader with a type including "Rocks Pirates" or up to 1 of your Characters with a type including "Rocks Pirates" gains +1000 power during this battle.',
  effects: {
    effects: [
      {
        trigger: "onOpponentAttack",
        optional: true,
        costs: [
          {
            cost: "restThisCard",
          },
          {
            cost: "trashFromHand",
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
              filters: [
                {
                  filter: "trait",
                  value: "Rocks Pirates",
                  match: "includes",
                },
              ],
            },
            value: 1000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op17Fullalead057I18n,
};
