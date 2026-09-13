import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lorraineAscendantWings: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "81gvGHkuVb",
  slug: "lorraine-ascendant-wings",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "81gvGHkuVb:face:default",
      catalogId: "81gvGHkuVb",
      name: "Lorraine, Ascendant Wings",
      lineageName: "Lorraine",
      cost: {
        kind: "memory",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 4,
        life: 32,
      },
      rulesText:
        "Lorraine Lineage\n\n(2024): Generate any amount of Sword regalia cards and put them onto the field. For the rest of the game, Sword weapons you control can attack as though they were allies. Activate this ability only if Lorraine is an Ascendant.",
      abilities: [
        {
          id: "81gvGHkuVb-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Lorraine Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Lorraine",
          },
        },
        {
          id: "81gvGHkuVb-a2",
          kind: "activated",
          text: "(2024): Generate any amount of Sword regalia cards and put them onto the field. For the rest of the game, Sword weapons you control can attack as though they were allies. Activate this ability only if Lorraine is an Ascendant.",
          activation: "ability",
          cost: {
            kind: "pay-reserve",
            amount: 2024,
          },
          condition: {
            kind: "all",
            conditions: [
              {
                kind: "champion-lineage-is",
                name: "Lorraine",
              },
              {
                kind: "subject-matches",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                filter: {
                  kind: "subtype",
                  oneOf: ["ASCENDANT"],
                },
              },
            ],
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "generate-selected",
                player: "controller",
                selection: {
                  id: "generated-swords",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "any-number",
                  },
                  allowRepeated: true,
                  candidates: {
                    kind: "catalog-card",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "supertype",
                          oneOf: ["REGALIA"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["SWORD"],
                        },
                      ],
                    },
                  },
                },
                destination: {
                  zone: "field",
                },
              },
              {
                kind: "rule-modification",
                mode: "allow",
                action: "attack-as-ally",
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
                          oneOf: ["WEAPON"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["SWORD"],
                        },
                      ],
                    },
                  },
                },
                duration: {
                  kind: "permanent",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default lorraineAscendantWings;
