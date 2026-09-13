import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const gateOfAlterity: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "j9s7xQdpf1",
  slug: "gate-of-alterity",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "j9s7xQdpf1:face:default",
      catalogId: "j9s7xQdpf1",
      name: "Gate of Alterity",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["SPIRIT"],
        subtypes: ["SPIRIT", "GATE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        'REST: Put Gate of Alterity on the bottom of your champion\'s lineage then choose a class. Gate of Alterity gains "Inherited Effect: This object is the chosen class in addition to its other classes."',
      abilities: [
        {
          id: "j9s7xQdpf1-a1",
          kind: "activated",
          text: 'REST: Put Gate of Alterity on the bottom of your champion\'s lineage then choose a class. Gate of Alterity gains "Inherited Effect: This object is the chosen class in addition to its other classes."',
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "move",
                subject: {
                  kind: "source",
                },
                destination: {
                  zone: "inner-lineage",
                  host: {
                    kind: "champion",
                    player: "controller",
                  },
                  placement: {
                    kind: "bottom",
                  },
                },
              },
              {
                kind: "choose",
                selection: {
                  id: "chosen-class",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  unique: true,
                  candidates: {
                    kind: "characteristic",
                    characteristic: "class",
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
                    id: "granted-1d5diq1-a1",
                    kind: "static",
                    staticKind: "effects",
                    text: "Inherited Effect: This object is the chosen class in addition to its other classes.",
                    executionSource: "lineage-host",
                    functionalZones: ["inner-lineage"],
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
                          layer: "B",
                          modifies: "type",
                        },
                        change: {
                          kind: "add-tracked-characteristic",
                          characteristic: "class",
                          key: "chosen-class",
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

export default gateOfAlterity;
