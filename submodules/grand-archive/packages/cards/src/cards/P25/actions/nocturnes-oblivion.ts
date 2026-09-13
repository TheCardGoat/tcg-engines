import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const nocturnesOblivion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1a5zdqgydt",
  slug: "nocturnes-oblivion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1a5zdqgydt:face:default",
      catalogId: "1a5zdqgydt",
      name: "Nocturne's Oblivion",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SPELL"],
      },
      elements: ["UMBRA"],
      speed: "fast",
      stats: {},
      rulesText:
        "As long as you have five or more omens with different reserve costs, this card costs 2 less to activate. \n\nDestroy target non-champion object. Banish Nocturne's Oblivion.",
      abilities: [
        {
          id: "1a5zdqgydt-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as you have five or more omens with different reserve costs, this card costs 2 less to activate.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "count",
                    distinctBy: "reserve-cost",
                    collection: {
                      zones: ["banishment"],
                      player: "controller",
                      filter: {
                        kind: "has-counter",
                        counter: "omen",
                      },
                    },
                  },
                  operator: "gte",
                  right: 5,
                },
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "1a5zdqgydt-a2",
          kind: "card-resolution",
          text: "Destroy target non-champion object. Banish Nocturne's Oblivion.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "not",
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "destroy",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                bindResultAs: "destroyed-object",
              },
              {
                kind: "banish-object",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default nocturnesOblivion;
