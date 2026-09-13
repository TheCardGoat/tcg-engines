import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfVeilara: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "GHS9GraLDo",
  slug: "lesser-boon-of-veilara",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "GHS9GraLDo:face:default",
      catalogId: "GHS9GraLDo",
      name: "Lesser Boon of Veilara",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["LESSER BOON"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Level Locked 1 (Play this card only if your champion’s base level is 1 or higher.)\n\nYour champion is a Cleric class in addition to their other types.",
      abilities: [
        {
          id: "GHS9GraLDo-a1",
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
          id: "GHS9GraLDo-a2",
          kind: "static",
          staticKind: "effects",
          text: "Your champion is a Cleric class in addition to their other types.",
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
                  value: "CLERIC",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default lesserBoonOfVeilara;
