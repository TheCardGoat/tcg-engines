import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sinisterMindreaver: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "jozihslnhz",
  slug: "sinister-mindreaver",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "jozihslnhz:face:default",
      catalogId: "jozihslnhz",
      name: "Sinister Mindreaver",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 2,
        life: 1,
      },
      rulesText:
        "[Class Bonus] Fast Activation\n\nAmbush (This ally may retaliate against attackers while not defending.)\n\nOn Champion Hit: Look at that opponent’s memory. You may discard up to two cards from it. If you do, they draw that many cards into their memory.",
      abilities: [
        {
          id: "jozihslnhz-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Fast Activation",
          keyword: {
            name: "fast-activation",
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
        {
          id: "jozihslnhz-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ambush (This ally may retaliate against attackers while not defending.)",
          keyword: {
            name: "ambush",
          },
        },
        {
          id: "jozihslnhz-a3",
          kind: "triggered",
          text: "On Champion Hit: Look at that opponent’s memory. You may discard up to two cards from it. If you do, they draw that many cards into their memory.",
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
                kind: "look-at",
                player: "event-recipient-controller",
                selection: {
                  id: "looked-memory",
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
                    player: "event-recipient-controller",
                  },
                },
              },
              {
                kind: "choose",
                selection: {
                  id: "discarded-cards",
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
                    binding: "looked-memory",
                  },
                },
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "move",
                      subject: {
                        kind: "bound",
                        binding: "discarded-cards",
                      },
                      from: "memory",
                      destination: {
                        zone: "graveyard",
                      },
                      bindResultAs: "discarded-card-count",
                    },
                    {
                      kind: "draw",
                      player: "event-recipient-controller",
                      amount: {
                        kind: "binding-count",
                        binding: "discarded-card-count",
                      },
                      to: "memory",
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default sinisterMindreaver;
