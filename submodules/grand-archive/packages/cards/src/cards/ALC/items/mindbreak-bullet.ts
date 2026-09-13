import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const mindbreakBullet: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "9htu9agwj4",
  slug: "mindbreak-bullet",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "9htu9agwj4:face:default",
      catalogId: "9htu9agwj4",
      name: "Mindbreak Bullet",
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
      elements: ["UMBRA"],
      stats: {
        power: 3,
      },
      rulesText:
        "REST: Load Mindbreak Bullet into target unloaded Gun weapon you control.\n\n[Class Bonus] On Champion Hit: Look at that opponent's memory and discard a card from it.",
      abilities: [
        {
          id: "9htu9agwj4-a1",
          kind: "activated",
          text: "REST: Load Mindbreak Bullet into target unloaded Gun weapon you control.",
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
          id: "9htu9agwj4-a2",
          kind: "triggered",
          text: "[Class Bonus] On Champion Hit: Look at that opponent's memory and discard a card from it.",
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
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "look-at",
                player: "controller",
                selection: {
                  id: "looked-at-memory",
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
                  id: "discarded-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
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
                },
                effect: {
                  kind: "discard-object",
                  subject: {
                    kind: "bound",
                    binding: "discarded-card",
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

export default mindbreakBullet;
