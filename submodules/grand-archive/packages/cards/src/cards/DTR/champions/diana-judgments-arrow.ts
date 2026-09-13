import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dianaJudgmentsArrow: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wiztyu6o24",
  slug: "diana-judgments-arrow",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wiztyu6o24:face:default",
      catalogId: "wiztyu6o24",
      name: "Diana, Judgment's Arrow",
      lineageName: "Diana",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 2,
        life: 22,
      },
      rulesText:
        "Diana Lineage\n\nOn Enter: Load up to two Aethercharge cards from your hand and/or memory into an Aetherwing weapon you control. For each card loaded this way, draw a card into your memory. \n\nInherited Effect — Ranged 1",
      abilities: [
        {
          id: "wiztyu6o24-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Diana Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Diana",
          },
        },
        {
          id: "wiztyu6o24-a2",
          kind: "triggered",
          text: "On Enter: Load up to two Aethercharge cards from your hand and/or memory into an Aetherwing weapon you control. For each card loaded this way, draw a card into your memory.",
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
              id: "loaded-aethercharge-cards",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 2,
              },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["hand", "memory"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "subtype",
                  oneOf: ["AETHERCHARGE"],
                },
              },
            },
            effect: {
              kind: "conditional",
              condition: {
                kind: "collection-exists",
                collection: {
                  binding: "loaded-aethercharge-cards",
                },
              },
              then: {
                kind: "choose",
                selection: {
                  id: "aetherwing-weapon",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
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
                          kind: "subtype",
                          oneOf: ["AETHERWING"],
                        },
                      ],
                    },
                  },
                },
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "move",
                      subject: {
                        kind: "bound",
                        binding: "loaded-aethercharge-cards",
                      },
                      destination: {
                        zone: "loaded",
                        host: {
                          kind: "bound",
                          binding: "aetherwing-weapon",
                        },
                      },
                      bindResultAs: "loaded-card-count",
                    },
                    {
                      kind: "draw",
                      player: "controller",
                      amount: {
                        kind: "binding-count",
                        binding: "loaded-card-count",
                      },
                      to: "memory",
                    },
                  ],
                },
              },
            },
          },
        },
        {
          id: "wiztyu6o24-a3",
          kind: "static",
          staticKind: "intrinsic",
          text: "Inherited Effect — Ranged 1",
          keyword: {
            name: "ranged",
            value: 1,
          },
          label: {
            name: "Inherited Effect",
          },
          functionalZones: ["inner-lineage"],
          executionSource: "lineage-host",
        },
      ],
    },
  },
};

export default dianaJudgmentsArrow;
