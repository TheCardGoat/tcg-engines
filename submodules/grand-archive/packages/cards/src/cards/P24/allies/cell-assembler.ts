import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cellAssembler: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vc8sugly4w",
  slug: "cell-assembler",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vc8sugly4w:face:default",
      catalogId: "vc8sugly4w",
      name: "Cell Assembler",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "AUTOMATON"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 1,
      },
      rulesText: "On Enter: You may pay (2). If you do, summon a Powercell token rested.",
      abilities: [
        {
          id: "vc8sugly4w-a1",
          kind: "triggered",
          text: "On Enter: You may pay (2). If you do, summon a Powercell token rested.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
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
                    kind: "pay",
                    player: "controller",
                    cost: {
                      kind: "pay-reserve",
                      amount: 2,
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
                    kind: "summon",
                    object: "Powercell",
                    controller: "controller",
                    bindResultAs: "summoned-token",
                    entersWithStates: ["rested"],
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

export default cellAssembler;
