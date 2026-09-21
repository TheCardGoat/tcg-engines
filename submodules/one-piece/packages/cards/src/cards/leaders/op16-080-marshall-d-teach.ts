import type { LeaderCard } from "@tcg/op-types";
import { op16MarshallDTeach080I18n } from "./op16-080-marshall-d-teach.i18n.ts";

export const op16MarshallDTeach080: LeaderCard = {
  id: "OP16-080",
  canonicalId: "OP16-080",
  slug: "marshall-d-teach/op16-080",
  name: "Marshall.D.Teach",
  printings: [
    {
      id: "OP16-080",
      artId: "OP16-080",
      setCode: "OP16",
      collectorNumber: "080",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-080_00GcFmm.jpg",
      label: "Marshall.D.Teach (080)",
    },
    {
      id: "OP16-080_p1",
      artId: "OP16-080_p1",
      setCode: "OP16",
      collectorNumber: "080",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-080_p1_bQAsMJg.jpg",
      label: "Marshall.D.Teach (080) (Alternate Art)",
    },
  ],
  cardType: "leader",
  color: ["black", "yellow"],
  rarity: "L",
  setId: "OP16",
  power: 5000,
  life: 4,
  traits: ["Blackbeard Pirates The Seven Warlords of the Sea"],
  attribute: "special",
  effect:
    "[Opponent's Turn] All of your Characters gain +1 cost. [On your Opponent's Attack] [Once Per Turn] You may trash 1 card with a [Trigger] from your hand: Change the target of that attack to this Leader or to one of your {Blackbeard Pirates} type Character cards.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
            },
            value: 1,
          },
        ],
      },
    ],
    effects: [
      {
        trigger: "onOpponentAttack",
        optional: true,
        oncePerTurn: true,
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [{ filter: "hasTrigger", value: true }],
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
                        value: "Blackbeard Pirates",
                        match: "includes",
                      },
                    ],
                  ],
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op16MarshallDTeach080I18n,
};
