import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const zenaEchoWeaver: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vxzsjRxMIn",
  slug: "zena-echo-weaver",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vxzsjRxMIn:face:default",
      catalogId: "vxzsjRxMIn",
      name: "ZENA, Echo Weaver",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["CLERIC", "WARRIOR"],
        subtypes: ["CLERIC", "WARRIOR", "RESONATOR", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "While paying for this card's reserve cost, you may banish up to two Harmony and/or Melody cards from your graveyard. Each card banished this way pays for 2 of that cost.\n\n[Level 1+] Vigor (This ally wakes up at the beginning of your end phase.)",
      abilities: [
        {
          id: "vxzsjRxMIn-a1",
          kind: "static",
          staticKind: "effects",
          text: "While paying for this card's reserve cost, you may banish up to two Harmony and/or Melody cards from your graveyard. Each card banished this way pays for 2 of that cost.",
          effects: [
            {
              kind: "rule-modification",
              mode: "payment-contribution",
              action: "pay-cost",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              cost: {
                kind: "select-and-move",
                player: "controller",
                from: "graveyard",
                to: "banishment",
                count: {
                  kind: "up-to",
                  amount: 2,
                },
                filter: {
                  kind: "subtype",
                  oneOf: ["HARMONY", "MELODY"],
                },
              },
              amount: 2,
              contributionBasis: "per-paid-object",
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "vxzsjRxMIn-a2",
          kind: "triggered",
          intrinsic: true,
          text: "[Level 1+] Vigor (This ally wakes up at the beginning of your end phase.)",
          keyword: {
            name: "vigor",
          },
          restrictions: [
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 1,
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default zenaEchoWeaver;
