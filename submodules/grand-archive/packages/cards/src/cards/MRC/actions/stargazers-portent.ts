import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const stargazersPortent: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "btjuxztaug",
  slug: "stargazers-portent",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "btjuxztaug:face:default",
      catalogId: "btjuxztaug",
      name: "Stargazer's Portent",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SKILL"],
      },
      elements: ["ASTRA"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to activate.\n\nThe next time you starcall a card this turn, copy that activation. You may choose new targets for the copy. ",
      abilities: [
        {
          id: "btjuxztaug-a1",
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
          id: "btjuxztaug-a2",
          kind: "card-resolution",
          text: "The next time you starcall a card this turn, copy that activation. You may choose new targets for the copy.",
          effect: {
            kind: "create-delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "card-activated",
                actor: "controller",
                subject: {
                  kind: "event-object",
                },
                activationState: "starcalled",
                isCopy: false,
              },
            },
            limit: 1,
            expires: {
              kind: "this-turn",
            },
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "copy",
                  subject: {
                    kind: "event-subject",
                  },
                  copy: "card-activation",
                  bindResultAs: "copied-activation",
                },
                {
                  kind: "optional",
                  player: "controller",
                  allOrNothing: true,
                  effect: {
                    kind: "retarget",
                    subject: {
                      kind: "bound",
                      binding: "copied-activation",
                    },
                    chooser: "controller",
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

export default stargazersPortent;
