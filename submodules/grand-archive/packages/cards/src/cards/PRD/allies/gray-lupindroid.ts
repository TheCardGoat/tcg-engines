import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const grayLupindroid: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qQ7DxBj1J0",
  slug: "gray-lupindroid",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qQ7DxBj1J0:face:default",
      catalogId: "qQ7DxBj1J0",
      name: "Gray Lupindroid",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "DISCORP", "AUTOMATON", "WOLF"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 1,
      },
      rulesText:
        "True Sight (This ally can attack units with stealth.)\n\n[Class Bonus] On Enter: You may sacrifice a Powercell. If you do, put a buff counter on Gray Lupindroid and draw a card into your memory.",
      abilities: [
        {
          id: "qQ7DxBj1J0-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "True Sight (This ally can attack units with stealth.)",
          keyword: {
            name: "true-sight",
          },
        },
        {
          id: "qQ7DxBj1J0-a2",
          kind: "triggered",
          text: "[Class Bonus] On Enter: You may sacrifice a Powercell. If you do, put a buff counter on Gray Lupindroid and draw a card into your memory.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
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
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "choose",
                  selection: {
                    id: "sacrificed-object",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    candidates: {
                      kind: "object",
                      zones: ["field"],
                      relationship: "controlled-by",
                      player: "controller",
                      filter: {
                        kind: "subtype",
                        oneOf: ["POWERCELL"],
                      },
                    },
                  },
                  effect: {
                    kind: "sacrifice",
                    subject: {
                      kind: "bound",
                      binding: "sacrificed-object",
                    },
                  },
                },
                {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "add-counter",
                      subject: {
                        kind: "source",
                      },
                      counter: "buff",
                      amount: 1,
                    },
                    {
                      kind: "draw",
                      player: "controller",
                      amount: 1,
                      to: "memory",
                    },
                  ],
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default grayLupindroid;
