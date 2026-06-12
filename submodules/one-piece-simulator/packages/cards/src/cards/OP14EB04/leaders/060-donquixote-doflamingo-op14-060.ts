import type { LeaderCard } from "@tcg/op-types";
import { op14eb04DonquixoteDoflamingoOp14060060I18n } from "./060-donquixote-doflamingo-op14-060.i18n.ts";

export const op14eb04DonquixoteDoflamingoOp14060060: LeaderCard = {
  id: "OP14-060",
  cardType: "leader",
  color: ["purple"],
  rarity: "L",
  setId: "OP14EB04",
  power: 5000,
  life: 5,
  traits: ["Donquixote Pirates The Seven Warlords of the Sea"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-060_p1.png",
      imageId: "OP14-060_p1",
    },
  ],
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
            action: "attackRestriction",
            restriction: "cannotAttackOtherThan",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            duration: "thisBattle",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op14eb04DonquixoteDoflamingoOp14060060I18n,
};
