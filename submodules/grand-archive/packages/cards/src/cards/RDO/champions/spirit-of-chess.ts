import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const spiritOfChess: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "AYe0neu31W",
  slug: "spirit-of-chess",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "AYe0neu31W:face:default",
      catalogId: "AYe0neu31W",
      name: "Spirit of Chess",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["SPIRIT"],
        subtypes: ["SPIRIT"],
      },
      elements: ["NORM"],
      stats: {
        level: 0,
        life: 15,
      },
      rulesText:
        "On Enter: Draw seven cards.\n\nInherited Effect — Ignore the elemental requirements of non-advanced element Chessman cards you play.",
      abilities: [
        {
          id: "AYe0neu31W-a1",
          kind: "triggered",
          text: "On Enter: Draw seven cards.",
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
            kind: "draw",
            player: "controller",
            amount: 7,
          },
        },
        {
          id: "AYe0neu31W-a2",
          kind: "static",
          staticKind: "effects",
          text: "Inherited Effect — Ignore the elemental requirements of non-advanced element Chessman cards you play.",
          effects: [
            {
              kind: "rule-modification",
              mode: "allow",
              action: "ignore-element-requirement",
              filter: {
                kind: "all",
                filters: [
                  {
                    kind: "element-category",
                    value: "non-advanced",
                  },
                  {
                    kind: "subtype",
                    oneOf: ["CHESSMAN"],
                  },
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
          label: {
            name: "Inherited Effect",
          },
          functionalZones: ["inner-lineage"],
          executionSource: "lineage-host",
        },
      ],
    },
  },
};

export default spiritOfChess;
