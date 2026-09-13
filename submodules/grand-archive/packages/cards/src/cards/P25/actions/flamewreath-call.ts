import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const flamewreathCall: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "c8wwslgbvr",
  slug: "flamewreath-call",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "c8wwslgbvr:face:default",
      catalogId: "c8wwslgbvr",
      name: "Flamewreath Call",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] If you control a Beast ally, this card costs 3 less to activate. (Apply this effect only if your champion's class matches this card's class.)\n\nDeal 3 damage to up to two target allies.",
      abilities: [
        {
          id: "c8wwslgbvr-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] If you control a Beast ally, this card costs 3 less to activate. (Apply this effect only if your champion's class matches this card's class.)",
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
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 3,
              condition: {
                kind: "controls",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["BEAST"],
                    },
                  ],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "c8wwslgbvr-a2",
          kind: "card-resolution",
          text: "Deal 3 damage to up to two target allies.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 2,
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
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-1",
            },
            amount: 3,
          },
        },
      ],
    },
  },
};

export default flamewreathCall;
