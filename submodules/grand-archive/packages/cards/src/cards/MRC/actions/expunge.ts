import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const expunge: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "r73opcqtzs",
  slug: "expunge",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "r73opcqtzs:face:default",
      catalogId: "r73opcqtzs",
      name: "Expunge",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["UMBRA"],
      speed: "slow",
      stats: {},
      rulesText:
        "As an additional cost to activate this card, discard a Curse card from a champion’s lineage.\n\nDeal X damage to all units where X is the reserve cost of the discarded card.",
      abilities: [
        {
          id: "r73opcqtzs-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, discard a Curse card from a champion’s lineage.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "select-and-move",
                player: "each-player",
                from: "inner-lineage",
                to: "graveyard",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                filter: {
                  kind: "subtype",
                  oneOf: ["CURSE"],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "r73opcqtzs-a2",
          kind: "card-resolution",
          text: "Deal X damage to all units where X is the reserve cost of the discarded card.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "property",
                subject: {
                  kind: "bound",
                  binding: "discarded-card",
                },
                property: "reserve-cost",
                basis: "last-known",
                missing: "zero",
              },
            },
          ],
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "each",
              collection: {
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
            amount: {
              kind: "variable",
              symbol: "X",
            },
          },
        },
      ],
    },
  },
};

export default expunge;
