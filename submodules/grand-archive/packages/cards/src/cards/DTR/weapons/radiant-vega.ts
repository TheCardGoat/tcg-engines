import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const radiantVega: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "odcgpm3ugw",
  slug: "radiant-vega",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "odcgpm3ugw:face:default",
      catalogId: "odcgpm3ugw",
      name: "Radiant Vega",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "AETHERWING"],
      },
      elements: ["ASTRA"],
      stats: {
        power: 2,
        durability: 5,
      },
      rulesText:
        "[Diana Bonus] (2), REST, Remove two durability counters from Radiant Vega: Negate target card activation unless its controller pays (X), where X is the amount of Aethercharge cards loaded into Radiant Vega. Activate this ability only if your champion is distant.",
      abilities: [
        {
          id: "odcgpm3ugw-a1",
          kind: "activated",
          text: "[Diana Bonus] (2), REST, Remove two durability counters from Radiant Vega: Negate target card activation unless its controller pays (X), where X is the amount of Aethercharge cards loaded into Radiant Vega. Activate this ability only if your champion is distant.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
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
                amount: 2,
              },
            ],
          },
          condition: {
            kind: "object-state",
            subject: {
              kind: "champion",
              player: "controller",
            },
            state: "distant",
          },
          targets: [
            {
              id: "target-activation",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "stack-item",
                itemTypes: ["card-activation"],
              },
            },
          ],
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  zones: ["loaded"],
                  host: {
                    kind: "source",
                  },
                  relationship: "loaded-into",
                  filter: {
                    kind: "subtype",
                    oneOf: ["AETHERCHARGE"],
                  },
                },
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Diana",
              },
            },
          ],
          effect: {
            kind: "unless-paid",
            player: {
              controllerOf: "target-activation",
            },
            cost: {
              kind: "pay-reserve",
              amount: {
                kind: "count",
                collection: {
                  zones: ["loaded"],
                  host: {
                    kind: "source",
                  },
                  relationship: "loaded-into",
                  filter: {
                    kind: "subtype",
                    oneOf: ["AETHERCHARGE"],
                  },
                },
              },
            },
            otherwise: {
              kind: "negate",
              subject: {
                kind: "bound",
                binding: "target-activation",
              },
            },
          },
        },
      ],
    },
  },
};

export default radiantVega;
