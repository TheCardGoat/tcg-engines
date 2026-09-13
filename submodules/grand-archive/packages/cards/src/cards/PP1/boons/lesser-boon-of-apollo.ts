import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfApollo: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "9hA48XL1xV",
  slug: "lesser-boon-of-apollo",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "9hA48XL1xV:face:default",
      catalogId: "9hA48XL1xV",
      name: "Lesser Boon of Apollo",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["LESSER BOON"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Level Locked 1 (Play this card only if your champion’s base level is 1 or higher.)\n\nYour champion is a Ranger class in addition to their other types.\n",
      abilities: [
        {
          id: "9hA48XL1xV-a1",
          kind: "static",
          staticKind: "effects",
          text: "Level Locked 1 (Play this card only if your champion’s base level is 1 or higher.)",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "play",
              subject: {
                kind: "source",
              },
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
                    basis: "base",
                  },
                  operator: "gte",
                  right: 1,
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "9hA48XL1xV-a2",
          kind: "static",
          staticKind: "effects",
          text: "Your champion is a Ranger class in addition to their other types.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "champion",
                player: "controller",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "B",
                modifies: "type",
              },
              change: {
                kind: "add-characteristic",
                characteristic: {
                  kind: "class",
                  value: "RANGER",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default lesserBoonOfApollo;
