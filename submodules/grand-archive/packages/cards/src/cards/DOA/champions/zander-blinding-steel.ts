import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const zanderBlindingSteel: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "UAF6Nr7GUE",
  slug: "zander-blinding-steel",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "UAF6Nr7GUE:face:default",
      catalogId: "UAF6Nr7GUE",
      name: "Zander, Blinding Steel",
      lineageName: "Zander",
      cost: {
        kind: "memory",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["LUXEM"],
      stats: {
        level: 3,
        life: 25,
      },
      rulesText:
        'Zander Lineage (Zander, Blinding Steel must be leveled from a previous level "Zander" champion.)\n\nAt the beginning of your recollection phase, you may reveal all cards in your memory. For each luxem element card revealed, each opponent puts a card from their hand into their memory.',
      abilities: [
        {
          id: "UAF6Nr7GUE-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: 'Zander Lineage (Zander, Blinding Steel must be leveled from a previous level "Zander" champion.)',
          keyword: {
            name: "lineage",
            lineageName: "Zander",
          },
        },
        {
          id: "UAF6Nr7GUE-a2",
          kind: "triggered",
          text: "At the beginning of your recollection phase, you may reveal all cards in your memory. For each luxem element card revealed, each opponent puts a card from their hand into their memory.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "reveal",
                  player: "controller",
                  selection: {
                    id: "revealed-memory",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "all",
                    },
                    candidates: {
                      kind: "card",
                      zones: ["memory"],
                      relationship: "zone-of",
                      player: "controller",
                    },
                  },
                },
                {
                  kind: "for-each",
                  collection: {
                    binding: "revealed-memory",
                    filter: {
                      kind: "element",
                      oneOf: ["LUXEM"],
                    },
                  },
                  bindEachAs: "revealed-card",
                  effect: {
                    kind: "choose",
                    selection: {
                      id: "opponent-hand-card",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "each-opponent",
                      count: {
                        kind: "exactly",
                        amount: 1,
                      },
                      candidates: {
                        kind: "card",
                        zones: ["hand"],
                        relationship: "zone-of",
                        player: "each-opponent",
                      },
                    },
                    effect: {
                      kind: "move",
                      subject: {
                        kind: "bound",
                        binding: "opponent-hand-card",
                      },
                      from: "hand",
                      destination: {
                        zone: "memory",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default zanderBlindingSteel;
