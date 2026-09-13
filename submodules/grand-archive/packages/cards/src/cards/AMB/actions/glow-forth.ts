import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const glowForth: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "27jlb9h1a5",
  slug: "glow-forth",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "27jlb9h1a5:face:default",
      catalogId: "27jlb9h1a5",
      name: "Glow Forth",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SPELL"],
      },
      elements: ["LUXEM"],
      speed: "slow",
      stats: {},
      rulesText:
        "This card costs 1 less to activate for each Animal you control.\n\nPut a buff counter on each ally you control. \n\n[Level 4+] Draw a card into your memory.",
      abilities: [
        {
          id: "27jlb9h1a5-a1",
          kind: "static",
          staticKind: "effects",
          text: "This card costs 1 less to activate for each Animal you control.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: {
                kind: "count",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "subtype",
                    oneOf: ["ANIMAL"],
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
          id: "27jlb9h1a5-a2",
          kind: "card-resolution",
          text: "Put a buff counter on each ally you control.",
          effect: {
            kind: "add-counter",
            subject: {
              kind: "each",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
            counter: "buff",
            amount: 1,
          },
        },
        {
          id: "27jlb9h1a5-a3",
          kind: "card-resolution",
          text: "[Level 4+] Draw a card into your memory.",
          restrictions: [
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 4,
                },
              },
            },
          ],
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
      ],
    },
  },
};

export default glowForth;
