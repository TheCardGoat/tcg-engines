import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const beastbondClaws: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qmj9q5gmsp",
  slug: "beastbond-claws",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qmj9q5gmsp:face:default",
      catalogId: "qmj9q5gmsp",
      name: "Beastbond Claws",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "DISTORTION", "ACCESSORY"],
      },
      elements: ["UMBRA"],
      stats: {},
      rulesText:
        "Banish Beastbond Claws: Target Animal or Beast ally you control gets +2LIFE and gains stealth until end of turn. (Units with stealth can't be targeted by attacks unless permitted by true sight.)",
      abilities: [
        {
          id: "qmj9q5gmsp-a1",
          kind: "activated",
          text: "Banish Beastbond Claws: Target Animal or Beast ally you control gets +2LIFE and gains stealth until end of turn. (Units with stealth can't be targeted by attacks unless permitted by true sight.)",
          activation: "ability",
          cost: {
            kind: "banish-self",
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
                  property: "life",
                  operation: "add",
                  amount: 2,
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
                    name: "stealth",
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

export default beastbondClaws;
