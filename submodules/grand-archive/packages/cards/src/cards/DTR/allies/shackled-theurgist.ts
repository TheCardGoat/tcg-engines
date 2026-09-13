import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const shackledTheurgist: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vkqzk1jik7",
  slug: "shackled-theurgist",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vkqzk1jik7:face:default",
      catalogId: "vkqzk1jik7",
      name: "Shackled Theurgist",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPECTER"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 0,
        life: 2,
      },
      rulesText:
        "Taunt\n\nAs long as Shackled Theurgist is ephemeral, it gets +4POWER.\n\nOn Death: Target opponent may sacrifice an ally. If they don't, return Shackled Theurgist to the field. It gets +2LIFE until end of turn and becomes ephemeral. ",
      abilities: [
        {
          id: "vkqzk1jik7-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Taunt",
          keyword: {
            name: "taunt",
          },
        },
        {
          id: "vkqzk1jik7-a2",
          kind: "static",
          staticKind: "effects",
          text: "As long as Shackled Theurgist is ephemeral, it gets +4POWER.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "object-state",
                subject: {
                  kind: "source",
                },
                state: "ephemeral",
              },
              duration: {
                kind: "while-source-in-functional-zone",
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
                amount: 4,
              },
            },
          ],
        },
        {
          id: "vkqzk1jik7-a3",
          kind: "triggered",
          text: "On Death: Target opponent may sacrifice an ally. If they don't, return Shackled Theurgist to the field. It gets +2LIFE until end of turn and becomes ephemeral.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "source",
              },
            },
          },
          targets: [
            {
              id: "target-opponent",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "player",
                players: ["opponent"],
              },
            },
          ],
          effect: {
            kind: "optional",
            player: {
              binding: "target-opponent",
            },
            allOrNothing: true,
            effect: {
              kind: "choose",
              selection: {
                id: "sacrificed-ally",
                kind: "choice",
                declared: "resolution",
                chooser: {
                  binding: "target-opponent",
                },
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                unique: true,
                candidates: {
                  kind: "object",
                  zones: ["field"],
                  relationship: "controlled-by",
                  player: {
                    binding: "target-opponent",
                  },
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY"],
                  },
                },
              },
              effect: {
                kind: "sacrifice",
                subject: {
                  kind: "bound",
                  binding: "sacrificed-ally",
                },
              },
            },
            otherwise: {
              kind: "sequence",
              effects: [
                {
                  kind: "move",
                  subject: {
                    kind: "source",
                  },
                  from: "graveyard",
                  destination: {
                    zone: "field",
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
                    property: "life",
                    operation: "add",
                    amount: 2,
                  },
                },
                {
                  kind: "set-object-state",
                  subject: {
                    kind: "source",
                  },
                  state: "ephemeral",
                  value: true,
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default shackledTheurgist;
