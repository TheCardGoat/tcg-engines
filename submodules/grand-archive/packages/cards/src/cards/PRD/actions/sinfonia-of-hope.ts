import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sinfoniaOfHope: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7QmyDecqkk",
  slug: "sinfonia-of-hope",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7QmyDecqkk:face:default",
      catalogId: "7QmyDecqkk",
      name: "Sinfonia of Hope",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC", "TAMER"],
        subtypes: ["CLERIC", "TAMER", "SKILL", "MELODY"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Target ally gets +2LIFE until end of turn.\n\n[Class Bonus] The next Harmony card you activate this turn costs 2 less to activate. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "7QmyDecqkk-a1",
          kind: "card-resolution",
          text: "Target ally gets +2LIFE until end of turn.",
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
                  oneOf: ["ALLY"],
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
              layer: "E",
              modifies: "stat",
              sublayer: "modifier",
            },
            change: {
              kind: "numeric",
              property: "life",
              operation: "add",
              amount: 2,
            },
          },
        },
        {
          id: "7QmyDecqkk-a2",
          kind: "card-resolution",
          text: "[Class Bonus] The next Harmony card you activate this turn costs 2 less to activate. (Apply this effect only if your champion's class matches this card's class.)",
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
            kind: "rule-modification",
            mode: "modify-cost",
            action: "activate",
            subject: {
              kind: "player",
              player: "controller",
            },
            filter: {
              kind: "subtype",
              oneOf: ["HARMONY"],
            },
            costKind: "reserve",
            costOperation: "subtract",
            amount: 2,
            duration: {
              kind: "for-next-event",
              event: "card-activated",
              expires: {
                kind: "this-turn",
              },
            },
          },
        },
      ],
    },
  },
};

export default sinfoniaOfHope;
