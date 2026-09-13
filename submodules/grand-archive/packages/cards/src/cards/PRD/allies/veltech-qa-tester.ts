import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const veltechQaTester: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "2XWNCcPN6o",
  slug: "veltech-qa-tester",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "2XWNCcPN6o:face:default",
      catalogId: "2XWNCcPN6o",
      name: "VelTech QA Tester",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "On Enter: The next VelTech item card you activate targeting VelTech QA Tester this turn costs 3 less to activate. ",
      abilities: [
        {
          id: "2XWNCcPN6o-a1",
          kind: "triggered",
          text: "On Enter: The next VelTech item card you activate targeting VelTech QA Tester this turn costs 3 less to activate.",
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
            kind: "rule-modification",
            mode: "modify-cost",
            action: "activate",
            subject: {
              kind: "player",
              player: "controller",
            },
            filter: {
              kind: "all",
              filters: [
                {
                  kind: "type",
                  oneOf: ["ITEM"],
                },
                {
                  kind: "subtype",
                  oneOf: ["VELTECH"],
                },
              ],
            },
            condition: {
              kind: "ability-targets-subject",
              ability: "current",
              subject: {
                kind: "source",
              },
              quantifier: "any",
            },
            costKind: "reserve",
            costOperation: "subtract",
            amount: 3,
            occurrence: {
              count: 1,
              window: "this-turn",
              actorScope: "same-player",
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default veltechQaTester;
