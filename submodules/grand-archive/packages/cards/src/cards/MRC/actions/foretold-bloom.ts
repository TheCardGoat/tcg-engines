import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const foretoldBloom: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "lnhzj43qiw",
  slug: "foretold-bloom",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lnhzj43qiw:face:default",
      catalogId: "lnhzj43qiw",
      name: "Foretold Bloom",
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
      elements: ["ASTRA"],
      speed: "slow",
      stats: {},
      rulesText: "Until end of turn, Herbs you control gain “On Sacrifice: Glimpse 2.”",
      abilities: [
        {
          id: "lnhzj43qiw-a1",
          kind: "card-resolution",
          text: "Until end of turn, Herbs you control gain “On Sacrifice: Glimpse 2.”",
          effect: {
            kind: "continuous",
            subjects: {
              kind: "each",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "subtype",
                      oneOf: ["HERB"],
                    },
                  ],
                },
              },
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-ability",
              ability: {
                id: "granted-tv4wga-a1",
                kind: "triggered",
                text: "On Sacrifice: Glimpse 2.",
                trigger: {
                  kind: "event",
                  event: {
                    name: "object-sacrificed",
                    subject: {
                      kind: "source",
                    },
                  },
                },
                effect: {
                  kind: "keyword-action",
                  action: "glimpse",
                  amount: 2,
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default foretoldBloom;
