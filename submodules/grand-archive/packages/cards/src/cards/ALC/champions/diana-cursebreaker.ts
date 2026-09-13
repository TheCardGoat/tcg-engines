import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dianaCursebreaker: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "o0qtb31x97",
  slug: "diana-cursebreaker",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "o0qtb31x97:face:default",
      catalogId: "o0qtb31x97",
      name: "Diana, Cursebreaker",
      lineageName: "Diana",
      cost: {
        kind: "memory",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["UMBRA"],
      stats: {
        level: 3,
        life: 25,
      },
      rulesText:
        "Diana Lineage\n\nBanish all Curse cards from Diana's lineage: Materialize two Bullet cards from your material deck. Until end of turn, Diana gains \"On Attack: Wake up Diana.\" Activate this ability only if there are four or more Curse cards in Diana's lineage. ",
      abilities: [
        {
          id: "o0qtb31x97-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Diana Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Diana",
          },
        },
        {
          id: "o0qtb31x97-a2",
          kind: "activated",
          text: "Banish all Curse cards from Diana's lineage: Materialize two Bullet cards from your material deck. Until end of turn, Diana gains \"On Attack: Wake up Diana.\" Activate this ability only if there are four or more Curse cards in Diana's lineage.",
          activation: "ability",
          cost: {
            kind: "select-and-move",
            player: "controller",
            from: "inner-lineage",
            to: "banishment",
            host: {
              kind: "champion",
              player: "controller",
            },
            relationship: "lineage-of",
            count: {
              kind: "all",
            },
            filter: {
              kind: "subtype",
              oneOf: ["CURSE"],
            },
          },
          condition: {
            kind: "compare",
            comparison: {
              left: {
                kind: "count",
                collection: {
                  zones: ["inner-lineage"],
                  host: {
                    kind: "champion",
                    player: "controller",
                  },
                  relationship: "lineage-of",
                  filter: {
                    kind: "subtype",
                    oneOf: ["CURSE"],
                  },
                },
              },
              operator: "gte",
              right: 4,
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "choose",
                selection: {
                  id: "bullet-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 2,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["material-deck"],
                    relationship: "zone-of",
                    player: "controller",
                    filter: {
                      kind: "subtype",
                      oneOf: ["BULLET"],
                    },
                  },
                },
                effect: {
                  kind: "materialize-card",
                  subject: {
                    kind: "bound",
                    binding: "bullet-cards",
                  },
                  payCosts: true,
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
                  layer: "D",
                  modifies: "ability",
                },
                change: {
                  kind: "grant-ability",
                  ability: {
                    id: "granted-guor22-a1",
                    kind: "triggered",
                    text: "On Attack: Wake up Diana.",
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
                      kind: "wake",
                      subject: {
                        kind: "source",
                      },
                    },
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

export default dianaCursebreaker;
