import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const guanYuPrimeExemplar: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0oyxjld8jh",
  slug: "guan-yu-prime-exemplar",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0oyxjld8jh:face:default",
      catalogId: "0oyxjld8jh",
      name: "Guan Yu, Prime Exemplar",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 4,
      },
      rulesText:
        "As long as a Human ally you controlled has died this turn, this card costs 2 less to activate and you may activate it as though it had fast activation.\n\nAmbush, Retort 2",
      abilities: [
        {
          id: "0oyxjld8jh-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as a Human ally you controlled has died this turn, this card costs 2 less to activate and you may activate it as though it had fast activation.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 2,
              condition: {
                kind: "history",
                event: "object-died",
                window: "this-turn",
                actor: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["HUMAN"],
                    },
                  ],
                },
                minimum: 1,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
            {
              kind: "rule-modification",
              mode: "allow",
              action: "activate-fast",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "history",
                event: "object-died",
                window: "this-turn",
                actor: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["HUMAN"],
                    },
                  ],
                },
                minimum: 1,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "0oyxjld8jh-a2",
          kind: "keyword-group",
          text: "Ambush, Retort 2",
          keywords: [
            {
              name: "ambush",
            },
            {
              name: "retort",
              value: 2,
            },
          ],
        },
      ],
    },
  },
};

export default guanYuPrimeExemplar;
