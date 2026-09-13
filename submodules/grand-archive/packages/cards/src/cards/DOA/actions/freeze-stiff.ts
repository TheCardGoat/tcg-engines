import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const freezeStiff: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qyRKqSkAQX",
  slug: "freeze-stiff",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qyRKqSkAQX:face:default",
      catalogId: "qyRKqSkAQX",
      name: "Freeze Stiff",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Rest up to two target allies. If either of those allies are attacking, negate their attacks and end the combat phase. Class Bonus: Those allies don't wake up during their controller's next wake up phase. (Apply the additional effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "qyRKqSkAQX-a1",
          kind: "card-resolution",
          text: "Rest up to two target allies. If either of those allies are attacking, negate their attacks and end the combat phase. Class Bonus: Those allies don't wake up during their controller's next wake up phase. (Apply the additional effect only if your champion's class matches this card's class.)",
          targets: [
            {
              id: "target-allies",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 2,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "rest",
                subject: {
                  kind: "bound",
                  binding: "target-allies",
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "collection-exists",
                  collection: {
                    binding: "target-allies",
                    filter: {
                      kind: "object-state",
                      state: "attacking",
                    },
                  },
                },
                then: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "negate",
                      subject: {
                        kind: "attacks-by",
                        attacker: {
                          kind: "bound",
                          binding: "target-allies",
                        },
                      },
                    },
                    {
                      kind: "end-phase",
                      phase: "combat",
                    },
                  ],
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "champion-matches-source",
                  characteristic: "class",
                },
                then: {
                  kind: "for-each",
                  collection: {
                    binding: "target-allies",
                  },
                  bindEachAs: "frozen-ally",
                  effect: {
                    kind: "rule-modification",
                    mode: "forbid",
                    action: "wake",
                    subject: {
                      kind: "bound",
                      binding: "frozen-ally",
                    },
                    duration: {
                      kind: "until-end-of-next-phase",
                      phase: "wake-up",
                      whose: {
                        controllerOf: "frozen-ally",
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

export default freezeStiff;
