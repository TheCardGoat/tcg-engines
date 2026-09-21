import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const breakTheLine: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "VXHLfbZ6AB",
  slug: "break-the-line",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "VXHLfbZ6AB:face:default",
      catalogId: "VXHLfbZ6AB",
      name: "Break the Line",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SKILL", "REACTION"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Activate this card only during a combat phase.\n\nYou may banish a Warrior champion card from your material deck. If you do, end the combat phase. (As a phase ends, banish all triggers, activations, and materializations on the effects stack.)",
      abilities: [
        {
          id: "VXHLfbZ6AB-a1",
          kind: "static",
          staticKind: "effects",
          text: "Activate this card only during a combat phase.",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "phase",
                phase: "combat",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "VXHLfbZ6AB-a2",
          kind: "card-resolution",
          text: "You may banish a Warrior champion card from your material deck. If you do, end the combat phase. (As a phase ends, banish all triggers, activations, and materializations on the effects stack.)",
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
                        amount: 1,
                      },
                      candidates: {
                        kind: "card",
                        zones: ["material-deck"],
                        relationship: "zone-of",
                        player: "controller",
                        filter: {
                          kind: "type",
                          oneOf: ["CHAMPION"],
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
                    kind: "end-phase",
                    phase: "combat",
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

export default breakTheLine;
