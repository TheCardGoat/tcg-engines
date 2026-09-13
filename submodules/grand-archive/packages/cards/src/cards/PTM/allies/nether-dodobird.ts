import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const netherDodobird: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wtHBZAdTSv",
  slug: "nether-dodobird",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wtHBZAdTSv:face:default",
      catalogId: "wtHBZAdTSv",
      name: "Nether Dodobird",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPECTER", "ANIMAL", "BIRD"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Sacrifice Nether Dodobird: If Nether Dodobird was not ephemeral, draw a card into your memory. Otherwise, deal 2 damage to each champion you don't control. ",
      abilities: [
        {
          id: "wtHBZAdTSv-a1",
          kind: "activated",
          text: "Sacrifice Nether Dodobird: If Nether Dodobird was not ephemeral, draw a card into your memory. Otherwise, deal 2 damage to each champion you don't control.",
          activation: "ability",
          cost: {
            kind: "sacrifice",
            subject: {
              kind: "source",
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "not",
              condition: {
                kind: "object-state",
                subject: {
                  kind: "source",
                },
                state: "ephemeral",
                basis: "last-known",
              },
            },
            then: {
              kind: "draw",
              player: "controller",
              amount: 1,
              to: "memory",
            },
            else: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "each-opponent",
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                },
              },
              amount: 2,
            },
          },
        },
      ],
    },
  },
};

export default netherDodobird;
