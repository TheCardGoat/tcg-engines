import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const huangZhongUnerringAim: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "XikXt8WyNp",
  slug: "huang-zhong-unerring-aim",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "XikXt8WyNp:face:default",
      catalogId: "XikXt8WyNp",
      name: "Huang Zhong, Unerring Aim",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Ranged 2\n\n[Class Bonus] (3), Return Huang Zhong to its owner's memory: Ranger units you control become distant. This ability costs (2) less to activate as long as Huang Zhong is distant. ",
      abilities: [
        {
          id: "XikXt8WyNp-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 2",
          keyword: {
            name: "ranged",
            value: 2,
          },
        },
        {
          id: "XikXt8WyNp-a2",
          kind: "activated",
          text: "[Class Bonus] (3), Return Huang Zhong to its owner's memory: Ranger units you control become distant. This ability costs (2) less to activate as long as Huang Zhong is distant.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
              },
              {
                kind: "move-self",
                from: "field",
                to: "memory",
              },
            ],
          },
          costModifiers: [
            {
              operation: "subtract",
              amount: 2,
              condition: {
                kind: "object-state",
                subject: {
                  kind: "source",
                },
                state: "distant",
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
            kind: "set-object-state",
            subject: {
              kind: "each",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY", "CHAMPION"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["RANGER"],
                    },
                  ],
                },
              },
            },
            state: "distant",
            value: true,
          },
        },
      ],
    },
  },
};

export default huangZhongUnerringAim;
