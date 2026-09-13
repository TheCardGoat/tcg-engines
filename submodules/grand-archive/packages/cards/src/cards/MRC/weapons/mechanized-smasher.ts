import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const mechanizedSmasher: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qsm3n9yvn1",
  slug: "mechanized-smasher",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qsm3n9yvn1:face:default",
      catalogId: "qsm3n9yvn1",
      name: "Mechanized Smasher",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "FIST"],
      },
      elements: ["WIND"],
      stats: {
        power: 4,
        durability: 2,
      },
      rulesText:
        "[Class Bonus] This card costs 1 less to materialize.\n\nMechanized Smasher can’t be used with attack cards.\n\nAs an additional cost to use Mechanized Smasher for an attack, reveal four wind element cards from your memory. ",
      abilities: [
        {
          id: "qsm3n9yvn1-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to materialize.",
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
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "materialize",
              subject: {
                kind: "source",
              },
              costKind: "memory",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "qsm3n9yvn1-a2",
          kind: "static",
          staticKind: "effects",
          text: "Mechanized Smasher can’t be used with attack cards.",
          effects: [
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "use-with-attack-card",
              subject: {
                kind: "source",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "qsm3n9yvn1-a3",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to use Mechanized Smasher for an attack, reveal four wind element cards from your memory.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "use-weapon-for-attack",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "reveal",
                player: "controller",
                from: "memory",
                count: {
                  kind: "exactly",
                  amount: 4,
                },
                filter: {
                  kind: "element",
                  oneOf: ["WIND"],
                },
              },
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

export default mechanizedSmasher;
