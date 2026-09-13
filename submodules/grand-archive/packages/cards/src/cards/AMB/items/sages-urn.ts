import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sagesUrn: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "s7a4tm04ll",
  slug: "sages-urn",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "s7a4tm04ll:face:default",
      catalogId: "s7a4tm04ll",
      name: "Sage's Urn",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "ARTIFACT"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "At the beginning of your recollection phase, if there are less than four age counters on Sage's Urn, put an age counter on it.\n\nBanish Sage's Urn: Empower X, where X is the amount of age counters that were on Sage's Urn.",
      abilities: [
        {
          id: "s7a4tm04ll-a1",
          kind: "triggered",
          text: "At the beginning of your recollection phase, if there are less than four age counters on Sage's Urn, put an age counter on it.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "compare",
              comparison: {
                left: {
                  kind: "counter-count",
                  subject: {
                    kind: "source",
                  },
                  counter: {
                    named: "age",
                  },
                },
                operator: "lt",
                right: 4,
              },
            },
            then: {
              kind: "add-counter",
              subject: {
                kind: "source",
              },
              counter: {
                named: "age",
              },
              amount: 1,
            },
          },
        },
        {
          id: "s7a4tm04ll-a2",
          kind: "activated",
          text: "Banish Sage's Urn: Empower X, where X is the amount of age counters that were on Sage's Urn.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "counter-count",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "age",
                },
              },
            },
          ],
          effect: {
            kind: "keyword-action",
            action: "empower",
            amount: {
              kind: "variable",
              symbol: "X",
            },
          },
        },
      ],
    },
  },
};

export default sagesUrn;
