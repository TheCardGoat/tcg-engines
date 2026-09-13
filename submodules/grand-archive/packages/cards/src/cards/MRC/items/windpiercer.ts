import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const windpiercer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "hreqhj1trn",
  slug: "windpiercer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "hreqhj1trn:face:default",
      catalogId: "hreqhj1trn",
      name: "Windpiercer",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "BULLET"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
      },
      rulesText:
        "Renewable\n\nREST: Load Windpiercer into target unloaded Gun weapon you control.\n\nOn Attack: Glimpse 1, then reveal the top card of your deck. If that card is wind element, Windpiercer gets +2 POWER.",
      abilities: [
        {
          id: "hreqhj1trn-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Renewable",
          keyword: {
            name: "renewable",
          },
        },
        {
          id: "hreqhj1trn-a2",
          kind: "activated",
          text: "REST: Load Windpiercer into target unloaded Gun weapon you control.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          targets: [
            {
              id: "target-weapon",
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
          ],
          effect: {
            kind: "move",
            subject: {
              kind: "source",
            },
            destination: {
              zone: "loaded",
              host: {
                kind: "bound",
                binding: "target-weapon",
              },
            },
          },
        },
        {
          id: "hreqhj1trn-a3",
          kind: "triggered",
          text: "On Attack: Glimpse 1, then reveal the top card of your deck. If that card is wind element, Windpiercer gets +2 POWER.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "sequence",
                effects: [
                  {
                    kind: "keyword-action",
                    action: "glimpse",
                    amount: 1,
                  },
                  {
                    kind: "reveal",
                    player: "controller",
                    selection: {
                      id: "referenced-cards",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: 1,
                      },
                      candidates: {
                        kind: "card",
                        zones: ["main-deck"],
                        relationship: "zone-of",
                        player: "controller",
                        fromTop: true,
                      },
                    },
                  },
                ],
              },
              {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "referenced-cards",
                  },
                  filter: {
                    kind: "element",
                    oneOf: ["WIND"],
                  },
                },
                then: {
                  kind: "continuous",
                  subjects: {
                    kind: "source",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "permanent",
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
                    amount: 2,
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

export default windpiercer;
