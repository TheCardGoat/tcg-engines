import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const demonsAim: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6g7xgwve1d",
  slug: "demons-aim",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6g7xgwve1d:face:default",
      catalogId: "6g7xgwve1d",
      name: "Demon's Aim",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "CURSE", "SPELL"],
      },
      elements: ["UMBRA"],
      speed: "slow",
      stats: {},
      rulesText:
        "Put Demon's Aim on the bottom of your champion's lineage. Then your champion's attacks this turn gain true sight, \"This attack can't be redirected by intercept\", and \"Choose the targets for this attack as though units didn't have taunt.\"\n\nInherited Effect: This object gets -2 LIFE.",
      abilities: [
        {
          id: "6g7xgwve1d-a1",
          kind: "card-resolution",
          text: "Put Demon's Aim on the bottom of your champion's lineage. Then your champion's attacks this turn gain true sight, \"This attack can't be redirected by intercept\", and \"Choose the targets for this attack as though units didn't have taunt.\"",
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
                kind: "continuous",
                subjects: {
                  kind: "attacks-by",
                  attacker: {
                    kind: "champion",
                    player: "controller",
                  },
                },
                affectedSet: "dynamic",
                duration: {
                  kind: "this-turn",
                },
                layer: {
                  layer: "D",
                  modifies: "ability",
                },
                change: {
                  kind: "grant-keyword",
                  keyword: {
                    name: "true-sight",
                  },
                },
              },
              {
                kind: "rule-modification",
                mode: "forbid",
                action: "redirect",
                subject: {
                  kind: "attacks-by",
                  attacker: {
                    kind: "champion",
                    player: "controller",
                  },
                },
                abilityFilter: {
                  keyword: "intercept",
                },
                duration: {
                  kind: "this-turn",
                },
              },
              {
                kind: "rule-modification",
                mode: "allow",
                action: "declare-target",
                subject: {
                  kind: "attacks-by",
                  attacker: {
                    kind: "champion",
                    player: "controller",
                  },
                },
                ignoredKeyword: "taunt",
                duration: {
                  kind: "this-turn",
                },
              },
            ],
          },
        },
        {
          id: "6g7xgwve1d-a2",
          kind: "static",
          staticKind: "effects",
          text: "Inherited Effect: This object gets -2 LIFE.",
          label: {
            name: "Inherited Effect",
          },
          functionalZones: ["inner-lineage"],
          executionSource: "lineage-host",
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
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "life",
                operation: "subtract",
                amount: 2,
              },
            },
          ],
        },
      ],
    },
  },
};

export default demonsAim;
