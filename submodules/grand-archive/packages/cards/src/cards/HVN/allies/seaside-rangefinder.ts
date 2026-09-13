import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const seasideRangefinder: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5qyee9vkp8",
  slug: "seaside-rangefinder",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5qyee9vkp8:face:default",
      catalogId: "5qyee9vkp8",
      name: "Seaside Rangefinder",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Ranged 2 (As long as this unit is distant, its attacks get +2 POWER.)\n\n[Class Bonus] [Element Bonus] (2), Banish this card from your graveyard: Target unit becomes distant. (Activate this ability only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "5qyee9vkp8-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 2 (As long as this unit is distant, its attacks get +2 POWER.)",
          keyword: {
            name: "ranged",
            value: 2,
          },
        },
        {
          id: "5qyee9vkp8-a2",
          kind: "activated",
          text: "[Class Bonus] [Element Bonus] (2), Banish this card from your graveyard: Target unit becomes distant. (Activate this ability only if your champion's class matches this card's class.)",
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
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
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
            kind: "set-object-state",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            state: "distant",
            value: true,
          },
        },
      ],
    },
  },
};

export default seasideRangefinder;
