import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const consumptionRing: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "g8q7imka92",
  slug: "consumption-ring",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "g8q7imka92:face:default",
      catalogId: "g8q7imka92",
      name: "Consumption Ring",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "DISTORTION", "ACCESSORY"],
      },
      elements: ["ASTRA"],
      stats: {},
      rulesText:
        "Banish Consumption Ring: Until end of turn, non-ally cards your opponents activate cost (4) more to activate. Activate this ability only during an opponent's recollection phase.",
      abilities: [
        {
          id: "g8q7imka92-a1",
          kind: "activated",
          text: "Banish Consumption Ring: Until end of turn, non-ally cards your opponents activate cost (4) more to activate. Activate this ability only during an opponent's recollection phase.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          condition: {
            kind: "all",
            conditions: [
              {
                kind: "phase",
                phase: "recollection",
              },
              {
                kind: "turn-player",
                player: "opponent",
              },
            ],
          },
          effect: {
            kind: "rule-modification",
            mode: "add-cost",
            action: "activate",
            subject: {
              kind: "player",
              player: "each-opponent",
            },
            filter: {
              kind: "not",
              filter: {
                kind: "type",
                oneOf: ["ALLY"],
              },
            },
            cost: {
              kind: "pay-reserve",
              amount: 4,
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default consumptionRing;
