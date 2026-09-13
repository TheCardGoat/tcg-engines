import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tempestuousSeraphim: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "HYFtrEXYFi",
  slug: "tempestuous-seraphim",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "HYFtrEXYFi:face:default",
      catalogId: "HYFtrEXYFi",
      name: "Tempestuous Seraphim",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "ANGEL"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Fast Activation\n\nAdvanced Imbue 2 (You may reserve all cards revealed as you activate this card. If at least two of them are advanced element, this card becomes imbued.)\n\nOn Enter: As a Spell, if Tempestuous Seraphim is imbued, deal 4 damage to target attacking ally.",
      abilities: [
        {
          id: "HYFtrEXYFi-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Fast Activation",
          keyword: {
            name: "fast-activation",
          },
        },
        {
          id: "HYFtrEXYFi-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Advanced Imbue 2 (You may reserve all cards revealed as you activate this card. If at least two of them are advanced element, this card becomes imbued.)",
          keyword: {
            name: "imbue",
            value: 2,
            elementRequirement: "advanced",
          },
        },
        {
          id: "HYFtrEXYFi-a3",
          kind: "triggered",
          text: "On Enter: As a Spell, if Tempestuous Seraphim is imbued, deal 4 damage to target attacking ally.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
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
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "object-state",
                      state: "attacking",
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "perform-as",
            sourceKind: "spell",
            effect: {
              kind: "conditional",
              condition: {
                kind: "activation-state",
                state: "imbued",
              },
              then: {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "bound",
                  binding: "target-1",
                },
                amount: 4,
              },
            },
          },
        },
      ],
    },
  },
};

export default tempestuousSeraphim;
