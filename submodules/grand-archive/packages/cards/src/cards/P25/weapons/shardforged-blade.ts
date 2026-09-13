import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const shardforgedBlade: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Y34Imzlr0n",
  slug: "shardforged-blade",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Y34Imzlr0n:face:default",
      catalogId: "Y34Imzlr0n",
      name: "Shardforged Blade",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SWORD"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        durability: 3,
      },
      rulesText:
        "You may sacrifice a Memorite object while paying for this card's memory cost to pay for 1 of that cost.\n\n[Merlin Bonus] Shardforged Blade gets +2 POWER as long the attacker is attacking an ally with one or more sheen counters on it.",
      abilities: [
        {
          id: "Y34Imzlr0n-a1",
          kind: "card-resolution",
          text: "You may sacrifice a Memorite object while paying for this card's memory cost to pay for 1 of that cost.",
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
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
                    oneOf: ["MEMORITE"],
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
          },
        },
        {
          id: "Y34Imzlr0n-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Merlin Bonus] Shardforged Blade gets +2 POWER as long the attacker is attacking an ally with one or more sheen counters on it.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Merlin",
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
              condition: {
                kind: "current-attack-target-matches",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "has-counter",
                      counter: {
                        named: "sheen",
                      },
                    },
                  ],
                },
              },
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
      ],
    },
  },
};

export default shardforgedBlade;
