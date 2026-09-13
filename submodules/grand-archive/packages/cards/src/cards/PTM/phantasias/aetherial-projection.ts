import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aetherialProjection: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ud8s2Kjuyr",
  slug: "aetherial-projection",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ud8s2Kjuyr:face:default",
      catalogId: "ud8s2Kjuyr",
      name: "Aetherial Projection",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "AETHERCHARGE", "SPELL"],
      },
      elements: ["ASTRA"],
      stats: {
        power: 2,
      },
      rulesText:
        '[Diana Bonus] [Element Bonus] Aethercalling\n\n[Diana Bonus] [Element Bonus] You may have Aetherial Projection enter as a copy of any Aetherwing weapon you control, except it has "Ranger allies you control can attack using this weapon."',
      abilities: [
        {
          id: "ud8s2Kjuyr-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Diana Bonus] [Element Bonus] Aethercalling",
          keyword: {
            name: "aethercalling",
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Diana",
              },
            },
            {
              kind: "static",
              name: "element-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "element",
              },
            },
          ],
        },
        {
          id: "ud8s2Kjuyr-a2",
          kind: "static",
          staticKind: "effects",
          text: '[Diana Bonus] [Element Bonus] You may have Aetherial Projection enter as a copy of any Aetherwing weapon you control, except it has "Ranger allies you control can attack using this weapon."',
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Diana",
              },
            },
            {
              kind: "static",
              name: "element-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "element",
              },
            },
          ],
          effects: [
            {
              kind: "replacement",
              event: {
                name: "object-entered-field",
                subject: {
                  kind: "source",
                },
              },
              optionalFor: "controller",
              operation: {
                kind: "perform-before-commit",
                effect: {
                  kind: "choose",
                  selection: {
                    id: "copied-aetherwing",
                    kind: "choice",
                    declared: "event-processing",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    unique: true,
                    candidates: {
                      kind: "object",
                      zones: ["field"],
                      relationship: "controlled-by",
                      player: "controller",
                      filter: {
                        kind: "all",
                        filters: [
                          {
                            kind: "type",
                            oneOf: ["WEAPON"],
                          },
                          {
                            kind: "subtype",
                            oneOf: ["AETHERWING"],
                          },
                        ],
                      },
                    },
                  },
                  effect: {
                    kind: "sequence",
                    effects: [
                      {
                        kind: "become-copy",
                        subject: {
                          kind: "source",
                        },
                        copyOf: {
                          kind: "bound",
                          binding: "copied-aetherwing",
                        },
                        duration: {
                          kind: "permanent",
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
                            id: "granted-1hro2sz-a1",
                            kind: "static",
                            staticKind: "effects",
                            text: "Ranger allies you control can attack using this weapon.",
                            effects: [
                              {
                                kind: "rule-modification",
                                mode: "allow",
                                action: "use-weapon-for-attack",
                                subject: {
                                  kind: "each",
                                  collection: {
                                    zones: ["field"],
                                    player: "controller",
                                    filter: {
                                      kind: "all",
                                      filters: [
                                        {
                                          kind: "type",
                                          oneOf: ["ALLY"],
                                        },
                                        {
                                          kind: "subtype",
                                          oneOf: ["RANGER"],
                                        },
                                      ],
                                    },
                                  },
                                },
                                using: {
                                  kind: "ability-bearer",
                                },
                                duration: {
                                  kind: "while-source-in-functional-zone",
                                },
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
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

export default aetherialProjection;
