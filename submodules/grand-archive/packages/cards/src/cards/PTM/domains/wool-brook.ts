import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const woolBrook: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "lcCGyyNGuM",
  slug: "wool-brook",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lcCGyyNGuM:face:default",
      catalogId: "lcCGyyNGuM",
      name: "Wool Brook",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["DOMAIN"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "RIVER"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Wool Brook enters the field with a refinement counter on it.\n\nOn Enter: Draw a card into your memory.\n\n(6), Remove a refinement counter from Wool Brook: Draw a card into your memory.",
      abilities: [
        {
          id: "lcCGyyNGuM-a1",
          kind: "static",
          staticKind: "effects",
          text: "Wool Brook enters the field with a refinement counter on it.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "object-entered-field",
                subject: {
                  kind: "source",
                },
              },
              operation: {
                kind: "add-object-counters",
                counters: [
                  {
                    counter: {
                      named: "refinement",
                    },
                    amount: 1,
                  },
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "lcCGyyNGuM-a2",
          kind: "triggered",
          text: "On Enter: Draw a card into your memory.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
        {
          id: "lcCGyyNGuM-a3",
          kind: "activated",
          text: "(6), Remove a refinement counter from Wool Brook: Draw a card into your memory.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 6,
              },
              {
                kind: "remove-counter",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "refinement",
                },
                amount: 1,
              },
            ],
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
      ],
    },
  },
};

export default woolBrook;
