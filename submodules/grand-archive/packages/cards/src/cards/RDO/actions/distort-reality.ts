import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const distortReality: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "PhaEcpabC2",
  slug: "distort-reality",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "PhaEcpabC2:face:default",
      catalogId: "PhaEcpabC2",
      name: "Distort Reality",
      cost: {
        kind: "reserve",
        amount: 12,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ULTIMATE", "SPECTER", "SPELL"],
      },
      elements: ["UMBRA"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Alice Bonus] Put all cards from your deck into your graveyard. Then put any amount of Specter cards from your graveyard with total reserve cost 30 or less onto the field. They each become ephemeral.\n\n[Alice Bonus] Ephemerate — (15)",
      abilities: [
        {
          id: "PhaEcpabC2-a1",
          kind: "card-resolution",
          text: "[Alice Bonus] Put all cards from your deck into your graveyard. Then put any amount of Specter cards from your graveyard with total reserve cost 30 or less onto the field. They each become ephemeral.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Alice",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "mill",
                player: "controller",
                amount: {
                  kind: "all",
                },
              },
              {
                kind: "choose",
                selection: {
                  id: "specter-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "any-number",
                  },
                  unique: true,
                  aggregateConstraint: {
                    property: "reserve-cost",
                    operation: "sum",
                    operator: "lte",
                    value: 30,
                    basis: "base",
                  },
                  candidates: {
                    kind: "card",
                    zones: ["graveyard"],
                    relationship: "zone-of",
                    player: "controller",
                    filter: {
                      kind: "subtype",
                      oneOf: ["SPECTER"],
                    },
                  },
                },
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "move",
                      subject: {
                        kind: "bound",
                        binding: "specter-cards",
                      },
                      from: "graveyard",
                      destination: {
                        zone: "field",
                      },
                    },
                    {
                      kind: "set-object-state",
                      subject: {
                        kind: "bound",
                        binding: "specter-cards",
                      },
                      state: "ephemeral",
                      value: true,
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          id: "PhaEcpabC2-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Alice Bonus] Ephemerate — (15)",
          keyword: {
            name: "ephemerate",
            cost: {
              kind: "pay-reserve",
              amount: 15,
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Alice",
              },
            },
          ],
        },
      ],
    },
  },
};

export default distortReality;
