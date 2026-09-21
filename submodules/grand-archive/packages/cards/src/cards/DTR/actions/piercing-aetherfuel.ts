import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const piercingAetherfuel: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vo5q7letxz",
  slug: "piercing-aetherfuel",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vo5q7letxz:face:default",
      catalogId: "vo5q7letxz",
      name: "Piercing Aetherfuel",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL"],
      },
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "Draw a card, then discard a card. \n\n[Class Bonus] You may banish two fire element cards from your graveyard. If you do, your champion's next attack this turn using an Aetherwing weapon gains ”Combat damage dealt by this attack is unpreventable.”",
      abilities: [
        {
          id: "vo5q7letxz-a1",
          kind: "card-resolution",
          text: "Draw a card, then discard a card.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
              {
                kind: "discard",
                player: "controller",
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
                    zones: ["hand"],
                    relationship: "zone-of",
                    player: "controller",
                  },
                },
                bindResultAs: "discarded-card",
              },
            ],
          },
        },
        {
          id: "vo5q7letxz-a2",
          kind: "card-resolution",
          text: "[Class Bonus] You may banish two fire element cards from your graveyard. If you do, your champion's next attack this turn using an Aetherwing weapon gains ”Combat damage dealt by this attack is unpreventable.”",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "banish",
                  player: "controller",
                  selection: {
                    id: "fire-cards",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 2,
                    },
                    candidates: {
                      kind: "card",
                      zones: ["graveyard"],
                      relationship: "zone-of",
                      player: "controller",
                      filter: {
                        kind: "element",
                        oneOf: ["FIRE"],
                      },
                    },
                  },
                },
                {
                  kind: "create-delayed-trigger",
                  trigger: {
                    kind: "event",
                    event: {
                      name: "attack-declared",
                      subject: {
                        kind: "event-object",
                        controller: "controller",
                        filter: {
                          kind: "type",
                          oneOf: ["CHAMPION"],
                        },
                      },
                      using: {
                        kind: "event-object",
                        filter: {
                          kind: "subtype",
                          oneOf: ["AETHERWING"],
                        },
                      },
                    },
                  },
                  limit: 1,
                  expires: {
                    kind: "this-turn",
                  },
                  effect: {
                    kind: "rule-modification",
                    mode: "forbid",
                    action: "prevent-damage",
                    subject: {
                      kind: "current-attack",
                    },
                    damageKind: "combat",
                    duration: {
                      kind: "this-attack",
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

export default piercingAetherfuel;
