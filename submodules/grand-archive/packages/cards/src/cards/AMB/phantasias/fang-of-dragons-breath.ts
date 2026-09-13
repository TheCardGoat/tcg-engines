import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fangOfDragonsBreath: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "iebo5fu381",
  slug: "fang-of-dragons-breath",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "iebo5fu381:face:default",
      catalogId: "iebo5fu381",
      name: "Fang of Dragon's Breath",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SPELL"],
      },
      elements: ["FIRE"],
      stats: {},
      rulesText:
        'Polearm Weapon Link (This object enters the field linked to target Polearm weapon. If the link is broken, sacrifice this object.)\n\nLinked weapon gets +2 POWER.\n\n[Jin Bonus] Linked object has "REST, Remove a durability counter from this object: Deal 2 damage to target unit."',
      abilities: [
        {
          id: "iebo5fu381-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Polearm Weapon Link (This object enters the field linked to target Polearm weapon. If the link is broken, sacrifice this object.)",
          keyword: {
            name: "link",
            target: "polearm-weapon",
          },
        },
        {
          id: "iebo5fu381-a2",
          kind: "static",
          staticKind: "effects",
          text: "Linked weapon gets +2 POWER.",
          executionSource: "linked-object",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
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
                property: "power",
                operation: "add",
                amount: 2,
              },
            },
          ],
        },
        {
          id: "iebo5fu381-a3",
          kind: "static",
          staticKind: "effects",
          text: '[Jin Bonus] Linked object has "REST, Remove a durability counter from this object: Deal 2 damage to target unit."',
          executionSource: "linked-object",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Jin",
              },
            },
          ],
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
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
                  id: "granted-yyi36f-a1",
                  kind: "activated",
                  text: "REST, Remove a durability counter from this object: Deal 2 damage to target unit.",
                  activation: "ability",
                  cost: {
                    kind: "all",
                    costs: [
                      {
                        kind: "rest",
                        subject: {
                          kind: "source",
                        },
                      },
                      {
                        kind: "remove-counter",
                        subject: {
                          kind: "source",
                        },
                        counter: "durability",
                        amount: 1,
                      },
                    ],
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
                    kind: "deal-damage",
                    source: {
                      kind: "source",
                    },
                    recipient: {
                      kind: "bound",
                      binding: "target-1",
                    },
                    amount: 2,
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

export default fangOfDragonsBreath;
