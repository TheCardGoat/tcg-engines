import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const namelessChampionCr: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "b53ccl9ipn",
  slug: "nameless-champion-cr",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "b53ccl9ipn:face:default",
      catalogId: "b53ccl9ipn",
      name: "Nameless Champion",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["CLERIC", "RANGER"],
        subtypes: ["CLERIC", "RANGER", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 1,
        life: 20,
      },
      rulesText:
        "This champion can't level up.\n\n(6): Draw a card and put a level counter on Nameless Champion. Activate this ability only once. (Champions get +1 level for each level counter on them.)",
      abilities: [
        {
          id: "b53ccl9ipn-a1",
          kind: "static",
          staticKind: "effects",
          text: "This champion can't level up.",
          effects: [
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "level-up",
              subject: {
                kind: "source",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "b53ccl9ipn-a2",
          kind: "activated",
          text: "(6): Draw a card and put a level counter on Nameless Champion. Activate this ability only once. (Champions get +1 level for each level counter on them.)",
          activation: "ability",
          cost: {
            kind: "pay-reserve",
            amount: 6,
          },
          limit: {
            count: 1,
            per: "source-instance",
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
              {
                kind: "add-counter",
                subject: {
                  kind: "source",
                },
                counter: "level",
                amount: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default namelessChampionCr;
