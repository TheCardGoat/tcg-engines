import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const goldenGambit: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "B1EbF6jcYF",
  slug: "golden-gambit",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "B1EbF6jcYF:face:default",
      catalogId: "B1EbF6jcYF",
      name: "Golden Gambit",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "CHESSMAN", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Alice Bonus] Fast Activation (You may activate this card at fast speed.)\n\nAs an additional cost to activate this card, sacrifice a Chessman ally.\n\nDraw two cards.",
      abilities: [
        {
          id: "B1EbF6jcYF-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Alice Bonus] Fast Activation (You may activate this card at fast speed.)",
          keyword: {
            name: "fast-activation",
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Alice",
              },
            },
          ],
        },
        {
          id: "B1EbF6jcYF-a2",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, sacrifice a Chessman ally.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "activate",
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
                      oneOf: ["CHESSMAN"],
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
          id: "B1EbF6jcYF-a3",
          kind: "card-resolution",
          text: "Draw two cards.",
          effect: {
            kind: "draw",
            player: "controller",
            amount: 2,
          },
        },
      ],
    },
  },
};

export default goldenGambit;
