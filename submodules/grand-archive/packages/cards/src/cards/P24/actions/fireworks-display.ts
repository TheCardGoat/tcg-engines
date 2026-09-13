import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fireworksDisplay: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "sx6q3p6i0i",
  slug: "fireworks-display",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "sx6q3p6i0i:face:default",
      catalogId: "sx6q3p6i0i",
      name: "Fireworks Display",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Deal 1 damage to all units target player controls. Until end of turn, if a unit that player controls would die, banish it instead.",
      abilities: [
        {
          id: "sx6q3p6i0i-a1",
          kind: "card-resolution",
          text: "Deal 1 damage to all units target player controls. Until end of turn, if a unit that player controls would die, banish it instead.",
          targets: [
            {
              id: "target-player",
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
                players: ["controller", "opponent", "another-player"],
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "each",
                  collection: {
                    zones: ["field"],
                    player: {
                      binding: "target-player",
                    },
                    filter: {
                      kind: "type",
                      oneOf: ["ALLY", "CHAMPION"],
                    },
                  },
                },
                amount: 1,
              },
              {
                kind: "replacement",
                event: {
                  name: "object-would-die",
                  subject: {
                    kind: "event-object",
                    controller: {
                      binding: "target-player",
                    },
                    filter: {
                      kind: "type",
                      oneOf: ["ALLY", "CHAMPION"],
                    },
                  },
                },
                operation: {
                  kind: "replace-with",
                  effect: {
                    kind: "banish-object",
                    subject: {
                      kind: "event-subject",
                    },
                  },
                },
                duration: {
                  kind: "this-turn",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default fireworksDisplay;
