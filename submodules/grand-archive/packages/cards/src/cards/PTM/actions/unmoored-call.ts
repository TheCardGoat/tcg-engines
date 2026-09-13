import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const unmooredCall: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "etobC7HEHw",
  slug: "unmoored-call",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "etobC7HEHw:face:default",
      catalogId: "etobC7HEHw",
      name: "Unmoored Call",
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
        "Activate this card only during an opponent's recollection phase.\n\nChoose a number. Until end of turn, objects with reserve cost equal to that number enter the field rested. \n\nDraw a card into your memory.",
      abilities: [
        {
          id: "etobC7HEHw-a1",
          kind: "static",
          staticKind: "effects",
          text: "Activate this card only during an opponent's recollection phase.",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "all",
                conditions: [
                  {
                    kind: "phase",
                    phase: "recollection",
                  },
                  {
                    kind: "turn-player",
                    player: "opponent",
                  },
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "etobC7HEHw-a2",
          kind: "card-resolution",
          text: "Choose a number. Until end of turn, objects with reserve cost equal to that number enter the field rested.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "choose-value",
                selection: {
                  id: "chosen-reserve-cost",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  unique: true,
                  candidates: {
                    kind: "number",
                    minimum: 0,
                  },
                },
                trackAs: "chosen-reserve-cost",
              },
              {
                kind: "replacement",
                event: {
                  name: "object-entered-field",
                  subject: {
                    kind: "event-object",
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
                        right: {
                          kind: "binding",
                          binding: "chosen-reserve-cost",
                        },
                      },
                    },
                  },
                },
                operation: {
                  kind: "modify-object-state",
                  state: "rested",
                  value: true,
                },
                duration: {
                  kind: "this-turn",
                },
              },
            ],
          },
        },
        {
          id: "etobC7HEHw-a3",
          kind: "card-resolution",
          text: "Draw a card into your memory.",
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
      ],
    },
  },
};

export default unmooredCall;
