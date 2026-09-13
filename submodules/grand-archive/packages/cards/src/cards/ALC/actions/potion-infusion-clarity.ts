import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const potionInfusionClarity: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "300z2snsdw",
  slug: "potion-infusion-clarity",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "300z2snsdw:face:default",
      catalogId: "300z2snsdw",
      name: "Potion Infusion: Clarity",
      cost: {
        kind: "reserve",
        amount: 7,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 2 less to activate. (Apply this effect only if your champion's class matches this card's class.)\n\nRest target Potion. If you do, it gains \"On Sacrifice: Draw two cards\" until end of turn. (This trigger would resolve before the Potion's ability.)",
      abilities: [
        {
          id: "300z2snsdw-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 2 less to activate. (Apply this effect only if your champion's class matches this card's class.)",
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
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "300z2snsdw-a2",
          kind: "card-resolution",
          text: 'Rest target Potion. If you do, it gains "On Sacrifice: Draw two cards" until end of turn. (This trigger would resolve before the Potion\'s ability.)',
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
                  kind: "subtype",
                  oneOf: ["POTION"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "attempt",
                effect: {
                  kind: "rest",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                },
                bindSucceededAs: "prior-effect-succeeded",
              },
              {
                kind: "conditional",
                condition: {
                  kind: "effect-succeeded",
                  binding: "prior-effect-succeeded",
                },
                then: {
                  kind: "continuous",
                  subjects: {
                    kind: "bound",
                    binding: "target-1",
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
                      id: "granted-8rhks8-a1",
                      kind: "triggered",
                      text: "On Sacrifice: Draw two cards",
                      trigger: {
                        kind: "event",
                        event: {
                          name: "object-sacrificed",
                          subject: {
                            kind: "source",
                          },
                        },
                      },
                      effect: {
                        kind: "draw",
                        player: "controller",
                        amount: 2,
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

export default potionInfusionClarity;
