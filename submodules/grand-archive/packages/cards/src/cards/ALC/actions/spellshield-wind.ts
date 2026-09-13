import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const spellshieldWind: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "99sx6q3p6i",
  slug: "spellshield-wind",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "99sx6q3p6i:face:default",
      catalogId: "99sx6q3p6i",
      name: "Spellshield: Wind",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL", "REACTION"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to activate. \n\nThe next time damage would be dealt to your champion this turn, prevent that damage. If 3 or more damage was prevented this way, put a buff counter on an ally you control.",
      abilities: [
        {
          id: "99sx6q3p6i-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to activate.",
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
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "99sx6q3p6i-a2",
          kind: "card-resolution",
          text: "The next time damage would be dealt to your champion this turn, prevent that damage. If 3 or more damage was prevented this way, put a buff counter on an ally you control.",
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
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
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
            },
            operation: {
              kind: "prevent",
            },
            duration: {
              kind: "for-next-event",
              event: "damage-dealt",
              expires: {
                kind: "this-turn",
              },
            },
            afterApply: {
              kind: "conditional",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "modified-ability-result-amount",
                    metric: "damage-prevented",
                  },
                  operator: "gte",
                  right: 3,
                },
              },
              then: {
                kind: "add-counter",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                counter: "buff",
                amount: 1,
              },
            },
          },
        },
      ],
    },
  },
};

export default spellshieldWind;
