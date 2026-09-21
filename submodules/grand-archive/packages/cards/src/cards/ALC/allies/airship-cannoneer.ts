import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const airshipCannoneer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "d53zc9p4lp",
  slug: "airship-cannoneer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "d53zc9p4lp:face:default",
      catalogId: "d53zc9p4lp",
      name: "Airship Cannoneer",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "[Class Bonus] Ranged 4 (As long as this unit is distant, its attacks get +4 POWER. Apply this effect only if your champion's class matches this card's class.)\n\nOn Attack: You may banish three fire element cards from your graveyard. If you do, Airship Cannoneer becomes distant.",
      abilities: [
        {
          id: "d53zc9p4lp-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Ranged 4 (As long as this unit is distant, its attacks get +4 POWER. Apply this effect only if your champion's class matches this card's class.)",
          keyword: {
            name: "ranged",
            value: 4,
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
          id: "d53zc9p4lp-a2",
          kind: "triggered",
          text: "On Attack: You may banish three fire element cards from your graveyard. If you do, Airship Cannoneer becomes distant.",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "attempt",
                  effect: {
                    kind: "banish",
                    player: "controller",
                    selection: {
                      id: "banished-cards",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: 3,
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
                  bindSucceededAs: "optional-action-succeeded",
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "optional-action-succeeded",
                  },
                  then: {
                    kind: "set-object-state",
                    subject: {
                      kind: "source",
                    },
                    state: "distant",
                    value: true,
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

export default airshipCannoneer;
