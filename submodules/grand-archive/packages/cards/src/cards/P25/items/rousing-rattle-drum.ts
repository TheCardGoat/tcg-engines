import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const rousingRattleDrum: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "nxm05jkjxg",
  slug: "rousing-rattle-drum",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "nxm05jkjxg:face:default",
      catalogId: "nxm05jkjxg",
      name: "Rousing Rattle Drum",
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
      rulesText: "Banish Rousing Rattle Drum: Wake up target defending Animal or Beast ally.",
      abilities: [
        {
          id: "nxm05jkjxg-a1",
          kind: "activated",
          text: "Banish Rousing Rattle Drum: Wake up target defending Animal or Beast ally.",
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
            kind: "wake",
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

export default rousingRattleDrum;
