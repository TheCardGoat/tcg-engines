import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const prismaticSpirit: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "W3m0tnw4sr",
  slug: "prismatic-spirit",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "W3m0tnw4sr:face:default",
      catalogId: "W3m0tnw4sr",
      name: "Prismatic Spirit",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["SPIRIT"],
        subtypes: ["SPIRIT"],
      },
      elements: ["NORM"],
      stats: {
        level: 0,
        life: 15,
      },
      rulesText:
        'On Enter: Draw six cards then choose two basic elements. Prismatic Spirit gains "Inherited Effect: This object is each of the chosen elements in addition to its other elements."',
      abilities: [
        {
          id: "W3m0tnw4sr-a1",
          kind: "triggered",
          text: 'On Enter: Draw six cards then choose two basic elements. Prismatic Spirit gains "Inherited Effect: This object is each of the chosen elements in addition to its other elements."',
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
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 6,
              },
              {
                kind: "choose-value",
                trackAs: "chosen-elements",
                selection: {
                  id: "chosen-elements",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 2,
                  },
                  unique: true,
                  candidates: {
                    kind: "characteristic",
                    characteristic: "element",
                    optionsFrom: {
                      kind: "element-category",
                      value: "basic",
                    },
                  },
                },
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "source",
                },
                affectedSet: "locked",
                duration: {
                  kind: "permanent",
                },
                layer: {
                  layer: "D",
                  modifies: "ability",
                },
                change: {
                  kind: "grant-ability",
                  ability: {
                    id: "granted-181orle-a1",
                    kind: "static",
                    staticKind: "effects",
                    text: "Inherited Effect: This object is each of the chosen elements in addition to its other elements.",
                    label: {
                      name: "Inherited Effect",
                    },
                    effects: [
                      {
                        kind: "continuous",
                        subjects: {
                          kind: "ability-bearer",
                        },
                        affectedSet: "dynamic",
                        duration: {
                          kind: "while-source-in-functional-zone",
                        },
                        layer: {
                          layer: "C",
                          modifies: "element",
                        },
                        change: {
                          kind: "add-tracked-characteristic",
                          characteristic: "element",
                          key: "chosen-elements",
                        },
                      },
                    ],
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

export default prismaticSpirit;
