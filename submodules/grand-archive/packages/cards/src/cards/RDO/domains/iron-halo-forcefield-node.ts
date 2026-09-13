import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ironHaloForcefieldNode: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "8GTa6NS2RG",
  slug: "iron-halo-forcefield-node",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "8GTa6NS2RG:face:default",
      catalogId: "8GTa6NS2RG",
      name: "Iron Halo, Forcefield Node",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["DOMAIN"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SIEGEABLE", "SPIRE"],
      },
      elements: ["NEOS"],
      stats: {
        durability: 3,
      },
      rulesText:
        "If damage would be dealt to another object you control, prevent 2 of that damage.\n\nAt the beginning of your end phase, put a durability counter on Iron Halo for each of up to two tokens you control.",
      abilities: [
        {
          id: "8GTa6NS2RG-a1",
          kind: "static",
          staticKind: "effects",
          text: "If damage would be dealt to another object you control, prevent 2 of that damage.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                recipient: {
                  kind: "event-object",
                  controller: "controller",
                  filter: {
                    kind: "not-source",
                  },
                },
              },
              operation: {
                kind: "prevent",
                amount: 2,
              },
              duration: {
                kind: "while-source-on-field",
              },
            },
          ],
        },
        {
          id: "8GTa6NS2RG-a2",
          kind: "triggered",
          text: "At the beginning of your end phase, put a durability counter on Iron Halo for each of up to two tokens you control.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
              actor: "controller",
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: "durability",
            amount: {
              kind: "calculate",
              operator: "minimum",
              operands: [
                {
                  kind: "count",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "token",
                      value: true,
                    },
                  },
                },
                2,
              ],
            },
          },
        },
      ],
    },
  },
};

export default ironHaloForcefieldNode;
