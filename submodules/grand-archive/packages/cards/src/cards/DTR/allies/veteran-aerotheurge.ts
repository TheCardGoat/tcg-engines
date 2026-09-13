import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const veteranAerotheurge: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fta5isdgrk",
  slug: "veteran-aerotheurge",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fta5isdgrk:face:default",
      catalogId: "fta5isdgrk",
      name: "Veteran Aerotheurge",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "Ranged 2 (As long as this unit is distant, its attacks get +2POWER.) \n\n[Class Bonus] Ranged 2 (Multiple instances of ranged can stack.)\n\nThe first Aethercharge card you activate each turn costs 1 less to activate.\n",
      abilities: [
        {
          id: "fta5isdgrk-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 2 (As long as this unit is distant, its attacks get +2POWER.)",
          keyword: {
            name: "ranged",
            value: 2,
          },
        },
        {
          id: "fta5isdgrk-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Ranged 2 (Multiple instances of ranged can stack.)",
          keyword: {
            name: "ranged",
            value: 2,
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
        },
        {
          id: "fta5isdgrk-a3",
          kind: "static",
          staticKind: "effects",
          text: "The first Aethercharge card you activate each turn costs 1 less to activate.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "player",
                player: "controller",
              },
              filter: {
                kind: "subtype",
                oneOf: ["AETHERCHARGE"],
              },
              occurrence: {
                count: 1,
                window: "this-turn",
                actorScope: "same-player",
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
      ],
    },
  },
};

export default veteranAerotheurge;
