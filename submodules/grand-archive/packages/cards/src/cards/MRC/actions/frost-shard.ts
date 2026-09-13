import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const frostShard: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "jnsl7ddcgw",
  slug: "frost-shard",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "jnsl7ddcgw:face:default",
      catalogId: "jnsl7ddcgw",
      name: "Frost Shard",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["WATER"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] As long as your champion has leveled up this turn, you may activate this card from your graveyard. If you do, banish it as it resolves.\n\nDeal 2 damage to target unit. If that unit is rested, deal 3 damage to it instead.",
      abilities: [
        {
          id: "jnsl7ddcgw-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] As long as your champion has leveled up this turn, you may activate this card from your graveyard. If you do, banish it as it resolves.",
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
          effects: [
            {
              kind: "rule-modification",
              mode: "allow",
              action: "activate",
              subject: {
                kind: "source",
              },
              fromZone: "graveyard",
              condition: {
                kind: "history",
                event: "champion-leveled-up",
                window: "this-turn",
                actor: "controller",
                minimum: 1,
              },
              activationResult: {
                afterResolution: {
                  kind: "banish-object",
                  subject: {
                    kind: "source",
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "jnsl7ddcgw-a2",
          kind: "card-resolution",
          text: "Deal 2 damage to target unit. If that unit is rested, deal 3 damage to it instead.",
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
            kind: "conditional",
            condition: {
              kind: "object-state",
              subject: {
                kind: "bound",
                binding: "target-1",
              },
              state: "rested",
            },
            then: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "bound",
                binding: "target-1",
              },
              amount: 3,
            },
            else: {
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
      ],
    },
  },
};

export default frostShard;
