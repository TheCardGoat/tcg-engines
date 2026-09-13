import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const strategicWarfare: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "i1f0ht2tsn",
  slug: "strategic-warfare",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "i1f0ht2tsn:face:default",
      catalogId: "i1f0ht2tsn",
      name: "Strategic Warfare",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Allies you control get +1 POWER until end of turn.\n\n[Level 2+] Target unit gains true sight until end of turn. (Units with true sight can attack units with stealth.)",
      abilities: [
        {
          id: "i1f0ht2tsn-a1",
          kind: "card-resolution",
          text: "Allies you control get +1 POWER until end of turn.",
          effect: {
            kind: "continuous",
            subjects: {
              kind: "each",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
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
              amount: 1,
            },
          },
        },
        {
          id: "i1f0ht2tsn-a2",
          kind: "card-resolution",
          text: "[Level 2+] Target unit gains true sight until end of turn. (Units with true sight can attack units with stealth.)",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "level-restriction",
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
                    basis: "current",
                  },
                  operator: "gte",
                  right: 2,
                },
              },
            },
          ],
          effect: {
            kind: "continuous",
            subjects: {
              kind: "bound",
              binding: "target-1",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-keyword",
              keyword: {
                name: "true-sight",
              },
            },
          },
        },
      ],
    },
  },
};

export default strategicWarfare;
