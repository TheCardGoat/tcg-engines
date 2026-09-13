import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const pipersLullaby: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "raG5r85ieO",
  slug: "pipers-lullaby",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "raG5r85ieO:face:default",
      catalogId: "raG5r85ieO",
      name: "Piper's Lullaby",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL", "MELODY"],
      },
      elements: ["WATER"],
      speed: "slow",
      stats: {},
      rulesText:
        "If you control an Animal or Beast ally, your champion gets +1 level until end of turn.\n\n[Class Bonus] Rest up to one target ally. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "raG5r85ieO-a1",
          kind: "card-resolution",
          text: "If you control an Animal or Beast ally, your champion gets +1 level until end of turn.",
          effect: {
            kind: "conditional",
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
                      kind: "any",
                      filters: [
                        {
                          kind: "subtype",
                          oneOf: ["ANIMAL"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["BEAST"],
                        },
                      ],
                    },
                  ],
                },
              },
            },
            then: {
              kind: "continuous",
              subjects: {
                kind: "champion",
                player: "controller",
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
                property: "level",
                operation: "add",
                amount: 1,
              },
            },
          },
        },
        {
          id: "raG5r85ieO-a2",
          kind: "card-resolution",
          text: "[Class Bonus] Rest up to one target ally. (Apply this effect only if your champion's class matches this card's class.)",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
            kind: "rest",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
          },
        },
      ],
    },
  },
};

export default pipersLullaby;
