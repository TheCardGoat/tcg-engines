import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const protoKeyCrest: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "k5wrAxBbF9",
  slug: "proto-key-crest",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "k5wrAxBbF9:face:default",
      catalogId: "k5wrAxBbF9",
      name: "Proto Key Crest",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ARTIFACT"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText: "On Charge 3: Return Proto Key Crest to its owner's material deck and recover 3. ",
      abilities: [
        {
          id: "k5wrAxBbF9-a1",
          kind: "triggered",
          text: "On Charge 3: Return Proto Key Crest to its owner's material deck and recover 3.",
          label: {
            name: "On Charge",
            parameters: {
              threshold: 3,
            },
          },
          trigger: {
            kind: "event",
            event: {
              name: "counter-added",
              subject: {
                kind: "source",
              },
              counter: {
                named: "charge",
              },
            },
          },
          limit: {
            count: 1,
            per: "source-instance",
          },
          interveningCondition: {
            kind: "has-counter",
            subject: {
              kind: "source",
            },
            counter: {
              named: "charge",
            },
            comparison: {
              left: {
                kind: "counter-count",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "charge",
                },
              },
              operator: "gte",
              right: 3,
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "move",
                subject: {
                  kind: "source",
                },
                destination: {
                  zone: "material-deck",
                },
              },
              {
                kind: "recover",
                player: "controller",
                amount: 3,
              },
            ],
          },
        },
      ],
    },
  },
};

export default protoKeyCrest;
