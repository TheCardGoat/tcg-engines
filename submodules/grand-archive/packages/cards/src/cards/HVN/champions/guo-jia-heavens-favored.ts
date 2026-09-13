import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const guoJiaHeavensFavored: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "enxi6tshtu",
  slug: "guo-jia-heavens-favored",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "enxi6tshtu:face:default",
      catalogId: "enxi6tshtu",
      name: "Guo Jia, Heaven's Favored",
      lineageName: "Guo Jia",
      cost: {
        kind: "memory",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "HUMAN"],
      },
      elements: ["LUXEM"],
      stats: {
        level: 3,
        life: 25,
      },
      rulesText:
        "As long as you control a Shenju ally, this card costs 3 less to materialize.\n\nGuo Jia Lineage\n\nOn Enter: You may put three quest counters on Guo Jia. If you don't, recover 3.",
      abilities: [
        {
          id: "enxi6tshtu-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as you control a Shenju ally, this card costs 3 less to materialize.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "materialize",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["SHENJU"],
                      },
                    ],
                  },
                },
              },
              costKind: "memory",
              costOperation: "subtract",
              amount: 3,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "enxi6tshtu-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Guo Jia Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Guo Jia",
          },
        },
        {
          id: "enxi6tshtu-a3",
          kind: "triggered",
          text: "On Enter: You may put three quest counters on Guo Jia. If you don't, recover 3.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "add-counter",
              subject: {
                kind: "source",
              },
              counter: {
                named: "quest",
              },
              amount: 3,
            },
            otherwise: {
              kind: "recover",
              player: "controller",
              amount: 3,
            },
          },
        },
      ],
    },
  },
};

export default guoJiaHeavensFavored;
