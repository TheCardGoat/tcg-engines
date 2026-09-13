import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const automataGenesis: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0L0AUYTwqU",
  slug: "automata-genesis",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0L0AUYTwqU:face:default",
      catalogId: "0L0AUYTwqU",
      name: "Automata Genesis",
      cost: {
        kind: "reserve",
        amount: 12,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "ULTIMATE", "SPELL"],
      },
      elements: ["NEOS"],
      speed: "slow",
      stats: {},
      rulesText:
        "Summon three Titan Mk II tokens. \n\n[Tonoris Bonus] Put X buff counters on each token ally you control, where X is the amount of tokens you control.",
      abilities: [
        {
          id: "0L0AUYTwqU-a1",
          kind: "card-resolution",
          text: "Summon three Titan Mk II tokens.",
          effect: {
            kind: "summon",
            object: "Titan Mk II",
            controller: "controller",
            bindResultAs: "summoned-token",
            amount: 3,
          },
        },
        {
          id: "0L0AUYTwqU-a2",
          kind: "card-resolution",
          text: "[Tonoris Bonus] Put X buff counters on each token ally you control, where X is the amount of tokens you control.",
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
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "token",
                      value: true,
                    },
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                  ],
                },
              },
            },
          ],
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "token",
                    value: true,
                  },
                },
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Tonoris",
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            counter: "buff",
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

export default automataGenesis;
