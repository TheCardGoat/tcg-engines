import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const rescueTheHeir: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "t0240ykvj0",
  slug: "rescue-the-heir",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "t0240ykvj0:face:default",
      catalogId: "t0240ykvj0",
      name: "Rescue the Heir",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Level 1+] As long as you control a unique ally, this card costs 1 less to activate.\n\nReturn target ally you control to its owner's memory.",
      abilities: [
        {
          id: "t0240ykvj0-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Level 1+] As long as you control a unique ally, this card costs 1 less to activate.",
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
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "supertype",
                        oneOf: ["UNIQUE"],
                      },
                    ],
                  },
                },
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
        {
          id: "t0240ykvj0-a2",
          kind: "card-resolution",
          text: "Return target ally you control to its owner's memory.",
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
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "move",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            destination: {
              zone: "memory",
            },
          },
        },
      ],
    },
  },
};

export default rescueTheHeir;
