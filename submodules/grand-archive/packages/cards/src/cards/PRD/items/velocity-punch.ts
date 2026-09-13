import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const velocityPunch: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rZSnsLUzEd",
  slug: "velocity-punch",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "rZSnsLUzEd:face:default",
      catalogId: "rZSnsLUzEd",
      name: "Vel-ocity Punch",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "VELTECH", "FOOD"],
      },
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "(3), Sacrifice Vel-ocity Punch:  Deal 3 unpreventable damage to your champion. Draw two cards into your memory.",
      abilities: [
        {
          id: "rZSnsLUzEd-a1",
          kind: "activated",
          text: "(3), Sacrifice Vel-ocity Punch:  Deal 3 unpreventable damage to your champion. Draw two cards into your memory.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
              },
              {
                kind: "sacrifice",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "champion",
                  player: "controller",
                },
                amount: 3,
                preventable: false,
              },
              {
                kind: "draw",
                player: "controller",
                amount: 2,
                to: "memory",
              },
            ],
          },
        },
      ],
    },
  },
};

export default velocityPunch;
