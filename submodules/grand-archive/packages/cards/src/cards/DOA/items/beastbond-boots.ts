import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const beastbondBoots: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "xjuCkODVRx",
  slug: "beastbond-boots",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "xjuCkODVRx:face:default",
      catalogId: "xjuCkODVRx",
      name: "Beastbond Boots",
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
        "Banish Beastbond Boots: Your champion gains spellshroud until end of turn. Activate this ability only if you control an Animal or Beast ally. (Units with spellshroud can't be targeted by Spells.)",
      abilities: [
        {
          id: "xjuCkODVRx-a1",
          kind: "activated",
          text: "Banish Beastbond Boots: Your champion gains spellshroud until end of turn. Activate this ability only if you control an Animal or Beast ally. (Units with spellshroud can't be targeted by Spells.)",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
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
          effect: {
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
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-keyword",
              keyword: {
                name: "spellshroud",
              },
            },
          },
        },
      ],
    },
  },
};

export default beastbondBoots;
