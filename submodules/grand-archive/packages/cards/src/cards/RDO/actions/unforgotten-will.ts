import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const unforgottenWill: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Yj77WUumhk",
  slug: "unforgotten-will",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Yj77WUumhk:face:default",
      catalogId: "Yj77WUumhk",
      name: "Unforgotten Will",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Banish Unforgotten Will and put an omen counter on it. If you do, draw a card into your memory.\n\nAs long as Unforgotten Will is an omen, cards you activate with reserve cost 3 cost 1 more to activate.",
      abilities: [
        {
          id: "Yj77WUumhk-a1",
          kind: "card-resolution",
          text: "Banish Unforgotten Will and put an omen counter on it. If you do, draw a card into your memory.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "attempt",
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "banish-object",
                      subject: {
                        kind: "source",
                      },
                      bindResultAs: "banished-source-omen",
                    },
                    {
                      kind: "add-counter",
                      subject: {
                        kind: "bound",
                        binding: "banished-source-omen",
                      },
                      counter: "omen",
                      amount: 1,
                    },
                  ],
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
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                  to: "memory",
                },
              },
            ],
          },
        },
        {
          id: "Yj77WUumhk-a2",
          kind: "static",
          staticKind: "effects",
          text: "As long as Unforgotten Will is an omen, cards you activate with reserve cost 3 cost 1 more to activate.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "player",
                player: "controller",
              },
              filter: {
                kind: "numeric",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "candidate",
                    },
                    property: "reserve-cost",
                    basis: "base",
                  },
                  operator: "eq",
                  right: 3,
                },
              },
              costKind: "reserve",
              costOperation: "add",
              amount: 1,
              condition: {
                kind: "all",
                conditions: [
                  {
                    kind: "source-zone",
                    zone: "banishment",
                  },
                  {
                    kind: "has-counter",
                    subject: {
                      kind: "source",
                    },
                    counter: "omen",
                  },
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default unforgottenWill;
