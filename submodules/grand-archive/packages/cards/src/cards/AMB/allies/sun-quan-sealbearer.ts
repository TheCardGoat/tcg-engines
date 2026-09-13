import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sunQuanSealbearer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "c5hgwip1ik",
  slug: "sun-quan-sealbearer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "c5hgwip1ik:face:default",
      catalogId: "c5hgwip1ik",
      name: "Sun Quan, Sealbearer",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["TAMER", "WARRIOR"],
        subtypes: ["TAMER", "WARRIOR", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "[Level 1+] On Enter: Put a buff counter on another target ally you control.\n\n[Level 2+] Allies you control with a buff counter on them lose pride.",
      abilities: [
        {
          id: "c5hgwip1ik-a1",
          kind: "triggered",
          text: "[Level 1+] On Enter: Put a buff counter on another target ally you control.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
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
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "not-source",
                    },
                  ],
                },
              },
            },
          ],
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
          effect: {
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            counter: "buff",
            amount: 1,
          },
        },
        {
          id: "c5hgwip1ik-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Level 2+] Allies you control with a buff counter on them lose pride.",
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
                  right: 2,
                },
              },
            },
          ],
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
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
                        kind: "has-counter",
                        counter: "buff",
                      },
                    ],
                  },
                },
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "remove-keyword",
                keyword: {
                  name: "pride",
                  anyValue: true,
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default sunQuanSealbearer;
