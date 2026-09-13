import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const bandOfBurningVerdict: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7mmve2l328",
  slug: "band-of-burning-verdict",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7mmve2l328:face:default",
      catalogId: "7mmve2l328",
      name: "Band of Burning Verdict",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ACCESSORY"],
      },
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "On Enter: Draw a card.\n\n[Class Bonus] REST: Target Animal or Beast ally you control gets +1 POWER and gains true sight until end of turn. (Units with true sight can attack units with stealth. Activate this ability only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "7mmve2l328-a1",
          kind: "triggered",
          text: "On Enter: Draw a card.",
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
            amount: 1,
          },
        },
        {
          id: "7mmve2l328-a2",
          kind: "activated",
          text: "[Class Bonus] REST: Target Animal or Beast ally you control gets +1 POWER and gains true sight until end of turn. (Units with true sight can attack units with stealth. Activate this ability only if your champion's class matches this card's class.)",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
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
            kind: "sequence",
            effects: [
              {
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
                  property: "power",
                  operation: "add",
                  amount: 1,
                },
              },
              {
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
            ],
          },
        },
      ],
    },
  },
};

export default bandOfBurningVerdict;
