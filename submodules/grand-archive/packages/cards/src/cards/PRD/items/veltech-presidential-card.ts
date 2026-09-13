import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const veltechPresidentialCard: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "S84TY03uxj",
  slug: "veltech-presidential-card",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "S84TY03uxj:face:default",
      catalogId: "S84TY03uxj",
      name: "VelTech Presidential Card",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "VELTECH", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Divine Relic\n\nVelTech cards you activate cost 1 less to activate.\n\nWhile paying for a VelTech card's memory cost, you may banish VelTech Presidential Card to pay for 1 of that cost.",
      abilities: [
        {
          id: "S84TY03uxj-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Divine Relic",
          keyword: {
            name: "divine-relic",
          },
        },
        {
          id: "S84TY03uxj-a2",
          kind: "static",
          staticKind: "effects",
          text: "VelTech cards you activate cost 1 less to activate.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              filter: {
                kind: "subtype",
                oneOf: ["VELTECH"],
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "S84TY03uxj-a3",
          kind: "static",
          staticKind: "effects",
          text: "While paying for a VelTech card's memory cost, you may banish VelTech Presidential Card to pay for 1 of that cost.",
          effects: [
            {
              kind: "rule-modification",
              mode: "payment-contribution",
              action: "pay-cost",
              subject: {
                kind: "player",
                player: "controller",
              },
              filter: {
                kind: "subtype",
                oneOf: ["VELTECH"],
              },
              costKind: "memory",
              cost: {
                kind: "banish-self",
              },
              amount: 1,
              contributionBasis: "total",
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default veltechPresidentialCard;
