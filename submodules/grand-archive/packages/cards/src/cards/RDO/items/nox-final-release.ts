import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const noxFinalRelease: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Gf33wXPzcg",
  slug: "nox-final-release",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Gf33wXPzcg:face:default",
      catalogId: "Gf33wXPzcg",
      name: "Nox, Final Release",
      cost: {
        kind: "reserve",
        amount: 10,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ITEM"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "ULTIMATE", "BULLET"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 4,
      },
      rulesText:
        "This card costs 2 less to activate for each Curse card in your champion's lineage.\n\nOn Enter: Load Nox into an unloaded Gun weapon you control.\n\n[Diana Bonus ] On Champion Hit: That opponent discards four cards. Then if that opponent's influence is four or less, destroy the hit champion.",
      abilities: [
        {
          id: "Gf33wXPzcg-a1",
          kind: "static",
          staticKind: "effects",
          text: "This card costs 2 less to activate for each Curse card in your champion's lineage.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: {
                kind: "calculate",
                operator: "multiply",
                operands: [
                  {
                    kind: "count",
                    collection: {
                      zones: ["inner-lineage"],
                      player: "controller",
                      filter: {
                        kind: "subtype",
                        oneOf: ["CURSE"],
                      },
                    },
                  },
                  2,
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "Gf33wXPzcg-a2",
          kind: "triggered",
          text: "On Enter: Load Nox into an unloaded Gun weapon you control.",
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
            kind: "choose",
            selection: {
              id: "chosen-weapon",
              kind: "choice",
              declared: "resolution",
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
                      oneOf: ["WEAPON"],
                    },
                    {
                      kind: "not",
                      filter: {
                        kind: "object-state",
                        state: "loaded",
                      },
                    },
                    {
                      kind: "subtype",
                      oneOf: ["GUN"],
                    },
                  ],
                },
              },
            },
            effect: {
              kind: "move",
              subject: {
                kind: "source",
              },
              destination: {
                zone: "loaded",
                host: {
                  kind: "bound",
                  binding: "chosen-weapon",
                },
              },
            },
          },
        },
        {
          id: "Gf33wXPzcg-a3",
          kind: "triggered",
          text: "[Diana Bonus ] On Champion Hit: That opponent discards four cards. Then if that opponent's influence is four or less, destroy the hit champion.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
              recipient: {
                kind: "event-object",
                bindAs: "trigger-recipient",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Diana",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "discard",
                player: "event-recipient-controller",
                selection: {
                  id: "discarded-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "event-recipient-controller",
                  count: {
                    kind: "exactly",
                    amount: 4,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["hand"],
                    relationship: "zone-of",
                    player: "event-recipient-controller",
                  },
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "player-property-compare",
                  players: "event-recipient-controller",
                  quantifier: "any",
                  property: "influence",
                  operator: "lte",
                  value: 4,
                },
                then: {
                  kind: "destroy",
                  subject: {
                    kind: "event-recipient",
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default noxFinalRelease;
