import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const stellarionShift: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ms2x2v4qe3",
  slug: "stellarion-shift",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ms2x2v4qe3:face:default",
      catalogId: "ms2x2v4qe3",
      name: "Stellarion Shift",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL", "REACTION"],
      },
      elements: ["ASTRA"],
      speed: "fast",
      stats: {},
      rulesText:
        "Target unit becomes distant. Draw a card.\n\n[Class Bonus] [Element Bonus] (2), Banish this card from your graveyard: Your champion gains stealth until end of turn. Prevent the next 4 non-combat damage that would be dealt to them this turn. Activate this ability only if your champion is distant.",
      abilities: [
        {
          id: "ms2x2v4qe3-a1",
          kind: "card-resolution",
          text: "Target unit becomes distant. Draw a card.",
          targets: [
            {
              id: "target-1",
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
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "set-object-state",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                state: "distant",
                value: true,
              },
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
            ],
          },
        },
        {
          id: "ms2x2v4qe3-a2",
          kind: "activated",
          text: "[Class Bonus] [Element Bonus] (2), Banish this card from your graveyard: Your champion gains stealth until end of turn. Prevent the next 4 non-combat damage that would be dealt to them this turn. Activate this ability only if your champion is distant.",
          activation: "ability",
          functionalZones: ["graveyard", "intent"],
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "banish-self",
              },
            ],
          },
          condition: {
            kind: "object-state",
            subject: {
              kind: "champion",
              player: "controller",
            },
            state: "distant",
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
            {
              kind: "static",
              name: "element-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "element",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "champion",
                  player: "controller",
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
                  kind: "grant-keyword",
                  keyword: {
                    name: "stealth",
                  },
                },
              },
              {
                kind: "replacement",
                event: {
                  name: "damage-dealt",
                  recipient: {
                    kind: "event-object",
                    controller: "controller",
                    filter: {
                      kind: "type",
                      oneOf: ["CHAMPION"],
                    },
                  },
                  combatDamage: false,
                },
                operation: {
                  kind: "prevent",
                },
                capacity: {
                  amount: 4,
                  scope: "replacement-instance",
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

export default stellarionShift;
