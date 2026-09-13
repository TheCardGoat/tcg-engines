import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const conduitOfTheMadMage: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6SXL09rEzS",
  slug: "conduit-of-the-mad-mage",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6SXL09rEzS:face:default",
      catalogId: "6SXL09rEzS",
      name: "Conduit of the Mad Mage",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["ARCANE"],
      stats: {
        power: 0,
        life: 2,
      },
      rulesText:
        "Whenever you activate a Mage Spell action, wake up Conduit of the Mad Mage, and it gets +1 POWER until end of turn.\n\nAt the beginning of your end phase, sacrifice Conduit of the Mad Mage.\n\nFloating Memory",
      abilities: [
        {
          id: "6SXL09rEzS-a1",
          kind: "triggered",
          text: "Whenever you activate a Mage Spell action, wake up Conduit of the Mad Mage, and it gets +1 POWER until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ACTION"],
                    },
                    {
                      kind: "class",
                      oneOf: ["MAGE"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["SPELL"],
                    },
                  ],
                },
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "wake",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "source",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
                },
                layer: {
                  layer: "E",
                  modifies: "stat",
                  sublayer: "modifier",
                },
                change: {
                  kind: "numeric",
                  property: "power",
                  operation: "add",
                  amount: 1,
                },
              },
            ],
          },
        },
        {
          id: "6SXL09rEzS-a2",
          kind: "triggered",
          text: "At the beginning of your end phase, sacrifice Conduit of the Mad Mage.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
              actor: "controller",
            },
          },
          effect: {
            kind: "sacrifice",
            subject: {
              kind: "source",
            },
          },
        },
        {
          id: "6SXL09rEzS-a3",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default conduitOfTheMadMage;
