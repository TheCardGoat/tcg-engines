import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const seedOfEmpowerment: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "XbYtI0XtVH",
  slug: "seed-of-empowerment",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "XbYtI0XtVH:face:default",
      catalogId: "XbYtI0XtVH",
      name: "Seed of Empowerment",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "CRYSTAL"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "At the beginning of your recollection phase, put a refinement counter on Seed of Empowerment.\n\nBanish Seed of Empowerment: Empower X, where X is the amount of refinement counters that was on Seed of Empowerment.",
      abilities: [
        {
          id: "XbYtI0XtVH-a1",
          kind: "triggered",
          text: "At the beginning of your recollection phase, put a refinement counter on Seed of Empowerment.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: {
              named: "refinement",
            },
            amount: 1,
          },
        },
        {
          id: "XbYtI0XtVH-a2",
          kind: "activated",
          text: "Banish Seed of Empowerment: Empower X, where X is the amount of refinement counters that was on Seed of Empowerment.",
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
                  named: "refinement",
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

export default seedOfEmpowerment;
