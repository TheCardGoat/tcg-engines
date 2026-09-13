import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const intwinedBangle: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "znavmjiefw",
  slug: "intwined-bangle",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "znavmjiefw:face:default",
      catalogId: "znavmjiefw",
      name: "Intwined Bangle",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "[Level 2+] (3), REST: Put a buff counter on target non-Human ally you control. (Allies get +1 POWER and +1 LIFE for each buff counter on them.)",
      abilities: [
        {
          id: "znavmjiefw-a1",
          kind: "activated",
          text: "[Level 2+] (3), REST: Put a buff counter on target non-Human ally you control. (Allies get +1 POWER and +1 LIFE for each buff counter on them.)",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
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
                      kind: "not",
                      filter: {
                        kind: "subtype",
                        oneOf: ["HUMAN"],
                      },
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
                  right: 2,
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
      ],
    },
  },
};

export default intwinedBangle;
