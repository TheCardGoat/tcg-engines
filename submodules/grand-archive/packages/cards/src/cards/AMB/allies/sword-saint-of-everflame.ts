import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const swordSaintOfEverflame: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "lpy7ie4v8n",
  slug: "sword-saint-of-everflame",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lpy7ie4v8n:face:default",
      catalogId: "lpy7ie4v8n",
      name: "Sword Saint of Everflame",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 3,
        life: 2,
      },
      rulesText:
        "[Class Bonus] (2), Banish this card from your graveyard: Target fire element weapon or ally gets +2 POWER until end of turn.",
      abilities: [
        {
          id: "lpy7ie4v8n-a1",
          kind: "activated",
          text: "[Class Bonus] (2), Banish this card from your graveyard: Target fire element weapon or ally gets +2 POWER until end of turn.",
          activation: "ability",
          functionalZones: ["graveyard", "intent"],
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "banish-self",
              },
            ],
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
                      oneOf: ["WEAPON"],
                    },
                    {
                      kind: "element",
                      oneOf: ["FIRE"],
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
              amount: 2,
            },
          },
        },
      ],
    },
  },
};

export default swordSaintOfEverflame;
