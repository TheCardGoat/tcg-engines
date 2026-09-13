import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const freezingRound: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "r7ch2bbmoq",
  slug: "freezing-round",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "r7ch2bbmoq:face:default",
      catalogId: "r7ch2bbmoq",
      name: "Freezing Round",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "BULLET"],
      },
      elements: ["WATER"],
      stats: {
        power: 2,
      },
      rulesText:
        "REST: Load Freezing Round into target unloaded Gun weapon you control.\n\nOn Champion Hit: That player banishes a card at random from their memory. Return that card to their memory at the beginning of their next end phase.\n\n[Class Bonus] Floating Memory",
      abilities: [
        {
          id: "r7ch2bbmoq-a1",
          kind: "activated",
          text: "REST: Load Freezing Round into target unloaded Gun weapon you control.",
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
          id: "r7ch2bbmoq-a2",
          kind: "triggered",
          text: "On Champion Hit: That player banishes a card at random from their memory. Return that card to their memory at the beginning of their next end phase.",
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
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "banish",
                player: "event-recipient-controller",
                selection: {
                  id: "banished-memory-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "event-recipient-controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["memory"],
                    relationship: "zone-of",
                    player: "event-recipient-controller",
                  },
                  method: "random",
                },
              },
              {
                kind: "create-delayed-trigger",
                trigger: {
                  kind: "event",
                  event: {
                    name: "phase-begins",
                    phase: "end",
                    actor: "event-recipient-controller",
                  },
                },
                limit: 1,
                effect: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "banished-memory-cards",
                  },
                  from: "banishment",
                  destination: {
                    zone: "memory",
                  },
                },
              },
            ],
          },
        },
        {
          id: "r7ch2bbmoq-a3",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory",
          keyword: {
            name: "floating-memory",
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
        },
      ],
    },
  },
};

export default freezingRound;
