import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const imperiousHighlander: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "659ytyj2s3",
  slug: "imperious-highlander",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "659ytyj2s3:face:default",
      catalogId: "659ytyj2s3",
      name: "Imperious Highlander",
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
        "On Enter: Imperious Highlander gets +X POWER until end of turn where X is the amount of allies target opponent controls more than you control.",
      abilities: [
        {
          id: "659ytyj2s3-a1",
          kind: "triggered",
          text: "On Enter: Imperious Highlander gets +X POWER until end of turn where X is the amount of allies target opponent controls more than you control.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
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
                    kind: "type",
                    oneOf: ["ALLY"],
                  },
                },
              },
            },
          ],
          effect: {
            kind: "continuous",
            subjects: {
              kind: "source",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
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
              amount: {
                kind: "variable",
                symbol: "X",
              },
            },
          },
        },
      ],
    },
  },
};

export default imperiousHighlander;
