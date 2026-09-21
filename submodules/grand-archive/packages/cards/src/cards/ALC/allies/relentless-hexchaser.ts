import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const relentlessHexchaser: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "por7ch2bbm",
  slug: "relentless-hexchaser",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "por7ch2bbm:face:default",
      catalogId: "por7ch2bbm",
      name: "Relentless Hexchaser",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Ranged 2\n\nOn Enter: If you control a distant unit, Relentless Hexchaser becomes distant.\n\n[Element Bonus] (2): Return Relentless Hexchaser from your graveyard to the field rested.",
      abilities: [
        {
          id: "por7ch2bbm-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 2",
          keyword: {
            name: "ranged",
            value: 2,
          },
        },
        {
          id: "por7ch2bbm-a2",
          kind: "triggered",
          text: "On Enter: If you control a distant unit, Relentless Hexchaser becomes distant.",
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
                      oneOf: ["ALLY", "CHAMPION"],
                    },
                    {
                      kind: "object-state",
                      state: "distant",
                    },
                  ],
                },
              },
            },
            then: {
              kind: "set-object-state",
              subject: {
                kind: "source",
              },
              state: "distant",
              value: true,
            },
          },
        },
        {
          id: "por7ch2bbm-a3",
          kind: "activated",
          text: "[Element Bonus] (2): Return Relentless Hexchaser from your graveyard to the field rested.",
          activation: "ability",
          functionalZones: ["graveyard"],
          cost: {
            kind: "pay-reserve",
            amount: 2,
          },
          restrictions: [
            {
              kind: "static",
              name: "element-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "element",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "move",
                subject: {
                  kind: "source",
                },
                from: "graveyard",
                destination: {
                  zone: "field",
                },
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default relentlessHexchaser;
