import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const pleiadesCelestialGenesis: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rsps1qnzfl",
  slug: "pleiades-celestial-genesis",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "rsps1qnzfl:face:default",
      catalogId: "rsps1qnzfl",
      name: "Pleiades, Celestial Genesis",
      cost: {
        kind: "memory",
        amount: 0,
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
        durability: 3,
      },
      rulesText:
        '[Class Bonus] On Enter: Glimpse 3.\n\n[Class Bonus] On Attack: Astra element Aethercharge cards in the attacker\'s intent gain "On Hit: Summon an Astral Shard token."',
      abilities: [
        {
          id: "rsps1qnzfl-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Glimpse 3.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
            kind: "keyword-action",
            action: "glimpse",
            amount: 3,
          },
        },
        {
          id: "rsps1qnzfl-a2",
          kind: "triggered",
          text: '[Class Bonus] On Attack: Astra element Aethercharge cards in the attacker\'s intent gain "On Hit: Summon an Astral Shard token."',
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
            kind: "continuous",
            subjects: {
              kind: "each",
              collection: {
                zones: ["intent"],
                host: {
                  kind: "event-attacker",
                },
                relationship: "intent-of",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "element",
                      oneOf: ["ASTRA"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["AETHERCHARGE"],
                    },
                  ],
                },
              },
            },
            affectedSet: "locked",
            duration: {
              kind: "this-attack",
            },
            layer: {
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-ability",
              ability: {
                id: "granted-1gg38yb-a1",
                kind: "triggered",
                text: "On Hit: Summon an Astral Shard token.",
                trigger: {
                  kind: "event",
                  event: {
                    name: "attack-hit",
                    subject: {
                      kind: "ability-bearer",
                    },
                  },
                },
                effect: {
                  kind: "summon",
                  object: "Astral Shard",
                  controller: "controller",
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default pleiadesCelestialGenesis;
