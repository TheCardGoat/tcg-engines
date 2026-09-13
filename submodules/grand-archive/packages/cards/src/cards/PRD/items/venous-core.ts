import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const venousCore: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "YTO70fFsBY",
  slug: "venous-core",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "YTO70fFsBY:face:default",
      catalogId: "YTO70fFsBY",
      name: "Venous Core",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "ELYSIAN", "ACCESSORY"],
      },
      elements: ["EXIA"],
      stats: {},
      rulesText:
        "As an additional cost to materialize this card, sacrifice an Elysian ally.\n\nElysian Aura\n\nYour champion gets +5LIFE.\n\n[Dante Bonus] [Damage 25+] Aenean Spell card activations you control can't be negated.",
      abilities: [
        {
          id: "YTO70fFsBY-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to materialize this card, sacrifice an Elysian ally.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "materialize",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "select-and-sacrifice",
                player: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                bindResultAs: "sacrificed-object",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["ELYSIAN"],
                    },
                  ],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "YTO70fFsBY-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Elysian Aura",
          keyword: {
            name: "elysian-aura",
          },
        },
        {
          id: "YTO70fFsBY-a3",
          kind: "static",
          staticKind: "effects",
          text: "Your champion gets +5LIFE.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "champion",
                player: "controller",
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
                operation: "add",
                amount: 5,
              },
            },
          ],
        },
        {
          id: "YTO70fFsBY-a4",
          kind: "static",
          staticKind: "effects",
          text: "[Dante Bonus] [Damage 25+] Aenean Spell card activations you control can't be negated.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Dante",
              },
            },
            {
              kind: "static",
              name: "damage-restriction",
              condition: {
                kind: "has-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "damage",
                comparison: {
                  left: {
                    kind: "counter-count",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    counter: "damage",
                  },
                  operator: "gte",
                  right: 25,
                },
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "negate",
              activationKind: "card",
              against: {
                kind: "each",
                collection: {
                  zones: ["effects-stack"],
                  player: "controller",
                  filter: {
                    kind: "subtype",
                    oneOf: ["SPELL"],
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

export default venousCore;
