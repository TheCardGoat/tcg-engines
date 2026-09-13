import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const beastbondPaws: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "F1t18omUlx",
  slug: "beastbond-paws",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "F1t18omUlx:face:default",
      catalogId: "F1t18omUlx",
      name: "Beastbond Paws",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Banish Beastbond Paws: Target Animal or Beast ally you control gets +1 POWER and gains true sight until end of turn. (Units with true sight can attack units with stealth.)",
      abilities: [
        {
          id: "F1t18omUlx-a1",
          kind: "activated",
          text: "Banish Beastbond Paws: Target Animal or Beast ally you control gets +1 POWER and gains true sight until end of turn. (Units with true sight can attack units with stealth.)",
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

export default beastbondPaws;
