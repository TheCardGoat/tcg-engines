import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const numinousMonk: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "NBf2d3iqXp",
  slug: "numinous-monk",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "NBf2d3iqXp:face:default",
      catalogId: "NBf2d3iqXp",
      name: "Numinous Monk",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC", "WARRIOR"],
        subtypes: ["CLERIC", "WARRIOR", "HUMAN"],
      },
      elements: ["CRUX"],
      stats: {
        power: 2,
        life: 4,
      },
      rulesText: 'Regalia you control have "REST: As a Spell, deal 1 damage to target unit."',
      abilities: [
        {
          id: "NBf2d3iqXp-a1",
          kind: "static",
          staticKind: "effects",
          text: 'Regalia you control have "REST: As a Spell, deal 1 damage to target unit."',
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "supertype",
                    oneOf: ["REGALIA"],
                  },
                },
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-ability",
                ability: {
                  id: "granted-17a3rk8-a1",
                  kind: "activated",
                  text: "REST: As a Spell, deal 1 damage to target unit.",
                  activation: "ability",
                  cost: {
                    kind: "rest",
                    subject: {
                      kind: "source",
                    },
                  },
                  targets: [
                    {
                      id: "target-1",
                      kind: "target",
                      declared: "announcement",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: 1,
                      },
                      unique: true,
                      candidates: {
                        kind: "object",
                        zones: ["field"],
                        filter: {
                          kind: "type",
                          oneOf: ["ALLY", "CHAMPION"],
                        },
                      },
                    },
                  ],
                  effect: {
                    kind: "perform-as",
                    sourceKind: "spell",
                    effect: {
                      kind: "deal-damage",
                      source: {
                        kind: "source",
                      },
                      recipient: {
                        kind: "bound",
                        binding: "target-1",
                      },
                      amount: 1,
                    },
                  },
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default numinousMonk;
