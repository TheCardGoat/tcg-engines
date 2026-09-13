import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const plutusFortunesFavor: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "bgbhr5vm38",
  slug: "plutus-fortunes-favor",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "bgbhr5vm38:face:default",
      catalogId: "bgbhr5vm38",
      name: "Plutus, Fortune's Favor",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "As an additional cost to activate this card, discard a card.\n\n[Class Bonus] As long as your influence is four or less, Plutus gets +2POWER and damage dealt by Plutus is unpreventable. (A player’s influence is equal to the total amount of cards in their hand and memory.)",
      abilities: [
        {
          id: "bgbhr5vm38-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, discard a card.",
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
                player: "controller",
                from: "hand",
                to: "graveyard",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "bgbhr5vm38-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] As long as your influence is four or less, Plutus gets +2POWER and damage dealt by Plutus is unpreventable. (A player’s influence is equal to the total amount of cards in their hand and memory.)",
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
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "player-property",
                    player: "controller",
                    property: "influence",
                  },
                  operator: "lte",
                  right: 4,
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
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "prevent-damage",
              using: {
                kind: "source",
              },
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "player-property",
                    player: "controller",
                    property: "influence",
                  },
                  operator: "lte",
                  right: 4,
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

export default plutusFortunesFavor;
