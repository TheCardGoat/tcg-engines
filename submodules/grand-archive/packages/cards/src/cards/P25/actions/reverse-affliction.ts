import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const reverseAffliction: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1bxh5xz2uz",
  slug: "reverse-affliction",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1bxh5xz2uz:face:default",
      catalogId: "1bxh5xz2uz",
      name: "Reverse Affliction",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SPELL"],
      },
      elements: ["UMBRA"],
      speed: "fast",
      stats: {},
      rulesText:
        "Banish a Curse card from your champion's lineage. If you own that card, put an omen counter on it.",
      abilities: [
        {
          id: "1bxh5xz2uz-a1",
          kind: "card-resolution",
          text: "Banish a Curse card from your champion's lineage. If you own that card, put an omen counter on it.",
          effect: {
            kind: "choose",
            selection: {
              id: "banished-cards",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["inner-lineage"],
                host: {
                  kind: "champion",
                  player: "controller",
                },
                relationship: "lineage-of",
                filter: {
                  kind: "subtype",
                  oneOf: ["CURSE"],
                },
              },
            },
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "banish-object",
                  subject: {
                    kind: "bound",
                    binding: "banished-cards",
                  },
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "owns-subject",
                    player: "controller",
                    subject: {
                      kind: "bound",
                      binding: "banished-cards",
                    },
                  },
                  then: {
                    kind: "add-counter",
                    subject: {
                      kind: "bound",
                      binding: "banished-cards",
                    },
                    counter: "omen",
                    amount: 1,
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default reverseAffliction;
