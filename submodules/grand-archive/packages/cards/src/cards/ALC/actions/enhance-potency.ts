import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const enhancePotency: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "df9q1wl8ao",
  slug: "enhance-potency",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "df9q1wl8ao:face:default",
      catalogId: "df9q1wl8ao",
      name: "Enhance Potency",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["WIND"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to activate.\n\nRest target Potion. If you do, the next time you activate an ability of that Potion this turn, copy that ability. You may choose new targets for the copy.",
      abilities: [
        {
          id: "df9q1wl8ao-a1",
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
          id: "df9q1wl8ao-a2",
          kind: "card-resolution",
          text: "Rest target Potion. If you do, the next time you activate an ability of that Potion this turn, copy that ability. You may choose new targets for the copy.",
          targets: [
            {
              id: "target-potion",
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
                bindSucceededAs: "potion-rested",
                effect: {
                  kind: "rest",
                  subject: {
                    kind: "bound",
                    binding: "target-potion",
                  },
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "effect-succeeded",
                  binding: "potion-rested",
                },
                then: {
                  kind: "create-delayed-trigger",
                  trigger: {
                    kind: "event",
                    event: {
                      name: "ability-activated",
                      actor: "controller",
                      subject: {
                        kind: "bound-object",
                        binding: "target-potion",
                      },
                    },
                  },
                  limit: 1,
                  expires: {
                    kind: "this-turn",
                  },
                  effect: {
                    kind: "copy",
                    subject: {
                      kind: "event-subject",
                    },
                    copy: "ability",
                    amount: 1,
                    mayChooseNewTargets: true,
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

export default enhancePotency;
