import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const zhangHeCloakOfNight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "09axbotwlz",
  slug: "zhang-he-cloak-of-night",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "09axbotwlz:face:default",
      catalogId: "09axbotwlz",
      name: "Zhang He, Cloak of Night",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Class Bonus] On Enter: Another target ally you control gains stealth for as long as you control Zhang He.",
      abilities: [
        {
          id: "09axbotwlz-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Another target ally you control gains stealth for as long as you control Zhang He.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
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
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "not-source",
                    },
                  ],
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
            kind: "continuous",
            subjects: {
              kind: "bound",
              binding: "target-1",
            },
            affectedSet: "locked",
            condition: {
              kind: "controls-subject",
              player: "controller",
              subject: {
                kind: "source",
              },
            },
            duration: {
              kind: "while-condition",
            },
            layer: {
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-keyword",
              keyword: {
                name: "stealth",
              },
            },
          },
        },
      ],
    },
  },
};

export default zhangHeCloakOfNight;
