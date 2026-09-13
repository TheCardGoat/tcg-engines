import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const strategemOfMyriadIce: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "id0ybub247",
  slug: "strategem-of-myriad-ice",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "id0ybub247:face:default",
      catalogId: "id0ybub247",
      name: "Strategem of Myriad Ice",
      cost: {
        kind: "reserve",
        amount: 6,
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
        "As long as your Shifting Currents face East, this card has efficiency.\n\nYou may banish any amount of cards with floating memory from your graveyard. When a card is banished this way, deal 3 damage to target unit you don't control.",
      abilities: [
        {
          id: "id0ybub247-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as your Shifting Currents face East, this card has efficiency.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "player-state",
                player: "controller",
                state: {
                  named: "shifting-currents",
                  value: "East",
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "efficiency",
                },
              },
            },
          ],
        },
        {
          id: "id0ybub247-a2",
          kind: "card-resolution",
          text: "You may banish any amount of cards with floating memory from your graveyard. When a card is banished this way, deal 3 damage to target unit you don't control.",
          effect: {
            kind: "reflexive",
            action: {
              kind: "banish",
              player: "controller",
              selection: {
                id: "floating-memory-cards",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "any-number",
                },
                candidates: {
                  kind: "card",
                  zones: ["graveyard"],
                  relationship: "zone-of",
                  player: "controller",
                  filter: {
                    kind: "has-keyword",
                    keyword: "floating-memory",
                  },
                },
              },
            },
            cardinality: "each-result-object",
            targets: [
              {
                id: "damaged-unit",
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
                  relationship: "controlled-by",
                  player: "opponent",
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY", "CHAMPION"],
                  },
                },
              },
            ],
            consequence: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "bound",
                binding: "damaged-unit",
              },
              amount: 3,
            },
          },
        },
      ],
    },
  },
};

export default strategemOfMyriadIce;
