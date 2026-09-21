import type { LeaderCard } from "@tcg/op-types";
import { op14eb04DonquixoteDoflamingoOp14060060I18n } from "./op14-060-donquixote-doflamingo-op14-060.i18n.ts";

export const op14eb04DonquixoteDoflamingoOp14060060: LeaderCard = {
  id: "OP14-060",
  canonicalId: "OP14-060",
  slug: "donquixote-doflamingo-op14-060",
  name: "Donquixote Doflamingo",
  printings: [
    {
      id: "OP14-060",
      artId: "OP14-060",
      setCode: "OP14",
      collectorNumber: "060",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-060_q0evlPP.jpg",
      label: "Donquixote Doflamingo - OP14-060",
    },
    {
      id: "OP14-060_p1",
      artId: "OP14-060_p1",
      setCode: "OP14",
      collectorNumber: "060",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-060_p1.jpg",
      label: "Donquixote Doflamingo - OP14-060 (Alternate Art)",
    },
  ],
  cardType: "leader",
  color: ["purple"],
  rarity: "L",
  setId: "OP14",
  power: 5000,
  life: 5,
  traits: ["Donquixote Pirates The Seven Warlords of the Sea"],
  attribute: "special",
  effect:
    "[On Your Opponent's Attack] [Once Per Turn] DON!! -1: Select your Leader or 1 of your {Donquixote Pirates} type Characters. Change the attack target to the selected card.",
  effects: {
    effects: [
      {
        trigger: "onOpponentAttack",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "changeBattleTarget",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "anyOf",
                  groups: [
                    [{ filter: "cardCategory", value: "leader" }],
                    [
                      {
                        filter: "trait",
                        value: "Donquixote Pirates",
                        match: "includes",
                      },
                    ],
                  ],
                },
              ],
            },
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op14eb04DonquixoteDoflamingoOp14060060I18n,
};
