import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const batteryCoreX: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "oqhB00zhaD",
  slug: "battery-core-x",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "oqhB00zhaD:face:default",
      catalogId: "oqhB00zhaD",
      name: "Battery Core X",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "VELTECH", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Hindered (This object enters the field rested.)\n\nREST, Banish Battery Core X: Target ally's next attack against a champion this turn gets +2POWER for each VelTech item linked to that ally.",
      abilities: [
        {
          id: "oqhB00zhaD-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Hindered (This object enters the field rested.)",
          keyword: {
            name: "hindered",
          },
        },
        {
          id: "oqhB00zhaD-a2",
          kind: "activated",
          text: "REST, Banish Battery Core X: Target ally's next attack against a champion this turn gets +2POWER for each VelTech item linked to that ally.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "banish-self",
              },
            ],
          },
          targets: [
            {
              id: "target-ally",
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
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "create-delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "attack-declared",
                subject: {
                  kind: "bound-object",
                  binding: "target-ally",
                },
                recipient: {
                  kind: "event-object",
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                },
              },
            },
            effect: {
              kind: "continuous",
              subjects: {
                kind: "current-attack",
              },
              affectedSet: "locked",
              duration: {
                kind: "this-attack",
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
                amount: {
                  kind: "calculate",
                  operator: "multiply",
                  operands: [
                    2,
                    {
                      kind: "count",
                      collection: {
                        zones: ["field"],
                        host: {
                          kind: "bound",
                          binding: "target-ally",
                        },
                        relationship: "linked-to",
                        filter: {
                          kind: "all",
                          filters: [
                            {
                              kind: "type",
                              oneOf: ["ITEM"],
                            },
                            {
                              kind: "subtype",
                              oneOf: ["VELTECH"],
                            },
                          ],
                        },
                      },
                    },
                  ],
                },
              },
            },
            limit: 1,
            expires: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default batteryCoreX;
