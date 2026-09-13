import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const spiritOfSlime: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0xp4xq07vv",
  slug: "spirit-of-slime",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0xp4xq07vv:face:default",
      catalogId: "0xp4xq07vv",
      name: "Spirit of Slime",
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
        "On Enter:Draw seven cards.\n\nInherited Effect: Ignore the elemental requirements of basic element Slime cards you activate.",
      abilities: [
        {
          id: "0xp4xq07vv-a1",
          kind: "triggered",
          text: "On Enter:Draw seven cards.",
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
          id: "0xp4xq07vv-a2",
          kind: "static",
          staticKind: "effects",
          text: "Inherited Effect: Ignore the elemental requirements of basic element Slime cards you activate.",
          effects: [
            {
              kind: "rule-modification",
              mode: "allow",
              action: "ignore-element-requirement",
              subject: {
                kind: "player",
                player: "controller",
              },
              filter: {
                kind: "all",
                filters: [
                  {
                    kind: "element-category",
                    value: "basic",
                  },
                  {
                    kind: "subtype",
                    oneOf: ["SLIME"],
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

export default spiritOfSlime;
