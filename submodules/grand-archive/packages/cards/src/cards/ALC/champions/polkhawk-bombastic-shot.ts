import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const polkhawkBombasticShot: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ryvfq3huqj",
  slug: "polkhawk-bombastic-shot",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ryvfq3huqj:face:default",
      catalogId: "ryvfq3huqj",
      name: "Polkhawk, Bombastic Shot",
      lineageName: "Polkhawk",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        level: 2,
        life: 22,
      },
      rulesText:
        "Ranged 2 (As long as this unit is distant, its attacks get +2 POWER.)\n\nRanger Reaction cards you activate cost 1 less to activate.",
      abilities: [
        {
          id: "ryvfq3huqj-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 2 (As long as this unit is distant, its attacks get +2 POWER.)",
          keyword: {
            name: "ranged",
            value: 2,
          },
        },
        {
          id: "ryvfq3huqj-a2",
          kind: "static",
          staticKind: "effects",
          text: "Ranger Reaction cards you activate cost 1 less to activate.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              filter: {
                kind: "subtype",
                oneOf: ["REACTION"],
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

export default polkhawkBombasticShot;
