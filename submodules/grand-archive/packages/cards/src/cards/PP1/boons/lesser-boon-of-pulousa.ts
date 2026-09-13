import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfPulousa: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "V6yubXhzYB",
  slug: "lesser-boon-of-pulousa",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "V6yubXhzYB:face:default",
      catalogId: "V6yubXhzYB",
      name: "Lesser Boon of Pulousa",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["LESSER BOON"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Level Locked 1 (Play this card only if your champion’s base level is 1 or higher.)\n\nYour champion is an Assassin class in addition to their other types.",
      abilities: [
        {
          id: "V6yubXhzYB-a1",
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
          id: "V6yubXhzYB-a2",
          kind: "static",
          staticKind: "effects",
          text: "Your champion is an Assassin class in addition to their other types.",
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
                  value: "ASSASSIN",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default lesserBoonOfPulousa;
